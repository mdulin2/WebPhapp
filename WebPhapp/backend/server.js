const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require("fs");
const crypto = require('crypto');
const app = express();

const conn = require('./connections.js') // private file not under VC.
const pbkdf2 = require('pbkdf2');
const auth = require('./auth_helper.js');
const Role = require("./role.js");
app.use(bodyParser.json() );        // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// establish a connection to the remote MySQL DB
if(conn.MySQL) {
    var connection = require('mysql2').createConnection(conn.MySQL);
    var mysql = require('./mysql_helper.js');
}

// use functions for interacting with Blockchain
if(conn.Blockchain) {
    var block_helper = require('./block_helper.js')
}

// JSON reader to read in dummy data
function readJsonFileSync(filepath, encoding){
    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

/*
    given a prescription, replaces all date integers with strings.
    Returns updated prescription.
    Assumes that all fields are properly filled.
*/
function convertDatesToString(prescription){
    prescription.writtenDate = new Date(prescription.writtenDate).toString();
    prescription.fillDates = prescription.fillDates.filter(dateInt => dateInt > 0);
    prescription.fillDates = prescription.fillDates.map(dateInt => new Date(dateInt).toString());

    // if cancelDate is -1 or 0, then there is no cancel date.
    // if a cancelDate exists, then convert it to a string representation.
    if(prescription.cancelDate > 0){
        prescription.cancelDate = new Date(prescription.cancelDate).toString();
    }
    return prescription;
}

// An api endpoint that cancels the prescription associated with a given prescription ID.
// example: http://localhost:5000/api/v1/prescriptions/cancel/2
app.get('/api/v1/prescriptions/cancel/:prescriptionID', auth.checkAuth([Role.Prescriber, Role.Dispenser]), (req,res) => {
    //TODO Check for valid prescriptionID

    // finish takes a string message and a boolean (true if successful)
    function finish(msg, success){
        console.log(msg);
        res.status(success ? 200 : 400).json(success);
        return;
    }

    //TODO Cancel the prescription on the blockchain
    return finish("TODO: build prescription cancel to blockchain", true);
});

/*
Edits a prescription for a given prescription ID. The prescriptionID is used in order to get the rest of the data for the prescription. The rest of the data points are alterable values.

 Expects on object of shape:
{
  prescriptionID,
  quantity,
  daysFor,
  refillsLeft,
  dispenserID
}

  Directly in terminal:
    >>> curl 'http://localhost:5000/api/v1/prescriptions/edit' -H 'Acceptapplication/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"prescriptionID": 3,"drugID":0,"quantity":1,"daysValid":0,"refills":0,"dispenserID":0}'

    To be used in an axios call:
        .post("/api/v1/prescription/edit",{
            prescriptionID: 0,
            ....
        }
*/

app.post('/api/v1/prescriptions/edit', auth.checkAuth([Role.Prescriber, Role.Dispenser]), (req,res) => {

    //TODO auth check needed here with cookie that goes with request headers
    const changedPrescription = req.body;

    // Should become actuall, non-static data
    var prescriptions = readJsonFileSync(
        __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;

    var prescription = prescriptions.find( function(elem) {
        return elem.prescriptionID === changedPrescription.prescriptionID;
    });

    // finish takes a string message and a boolean (true if successful)
    function finish(msg, success){
        console.log(msg);
        res.status(success ? 200 : 400).json(success);
        return;
    }

    // Ensures that a filled or cancelled prescription cannot be altered.
    if(prescription.cancelDate !== -1 || prescription.fillDates.length !== 0){
      res.send({})
      return finish('Attempt at cancelling fixed prescription', false);
    }


    //TODO Go into blockchain to call changing functions...The data for this is in the changedPrescription data.
    return finish("TODO: build prescription edit to blockchain", true);
});

/*
About:
    Attempts to add a prescription for a user, while also doing validation.
    Status of 200 if successful, 400 otherwise.
    Expects an object with all integer fields:
    {
        patientID,
        drugID,
        quantity,
        daysFor,
        refillsLeft,
        prescriberID,
        dispensorID
    }
Examples:
    Directly in terminal:
        >>> curl 'http://localhost:5000/api/v1/prescriptions/add' -H 'Accept: application/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"patientID":0,"drugID":13,"quantity":"1mg","daysValid":0,"refills":0,"prescriberID":0,"dispenserID":0}'
    To be used in Axois call:
        .post("/api/v1/prescription/add",{
            patientID: 0,
            ....
        }
Returns:
    true if prescription is added, false if not.
Note on daysFor field:
    https://github.com/Pharmachain/WebPhapp/pull/40/files#r259635589
*/
app.post('/api/v1/prescriptions/add', auth.checkAuth([Role.Prescriber]), (req,res) => {
    const prescription = req.body;

    // finish takes a string message and a boolean (true if successful)
    function finish(msg, success){
        console.log(msg);
        res.status(success ? 200 : 400).json(success);
        return;
    }

    // validate fields exist that should
    fields = [
        prescription.patientID,
        prescription.drugID,
        prescription.quantity,
        prescription.daysFor,
        prescription.refillsLeft,
        prescription.prescriberID,
        prescription.dispenserID
    ];
    fieldsSet = new Set(fields);
    if(fieldsSet.has(undefined) || fieldsSet.has(null)){
        return finish("Required prescription field(s) are null or undefined.", false)
    }

    // cast int fields to int
    try {
        prescription.patientID = parseInt(prescription.patientID);
        prescription.drugID = parseInt(prescription.drugID);
        prescription.daysFor = parseInt(prescription.daysFor);
        prescription.refillsLeft = parseInt(prescription.refillsLeft);
        prescription.prescriberID = parseInt(prescription.prescriberID);
        prescription.dispenserID = parseInt(prescription.dispenserID);
    } catch(error) {
        finish("Error casting fields to int: " + error.toString(), false);
    }

    // validate fields are of proper type
    for (var key in prescription){
        if(key === "quantity"){
            if(typeof prescription[key] !== "string"){
                return finish("Prescription field '" + key + "' should be of type String.", false);
            }
        } else if( !Number.isInteger(prescription[key]) ){
            return finish("Prescription field '" + key + "' should be of type Integer.", false);
        }
    }

    // validate there are no extraneous fields
    if(Object.keys(prescription).length > fields.length){
        return finish('Prescription input has too many fields.', false);
    }

    // other validation here should include:
    //  - When sessions are created, validate the prescriber based upon the session cookie, not the ID itself.
    //  - Validate the drugID, dispensorID, patient all exist.
    // we are ignoring this for now and will come back to it.

    // Add derived fields to the prescription
    prescription.fillDates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    prescription.writtenDate = new Date().getTime(); // time is in milliseconds since 1970 epoch.
    prescription.isCancelled = false;
    prescription.cancelDate = 0; // 0 means no date- not cancelled.

    // TODO: index this prescription in MySQL.
    console.log('Adding prescription to chain for patientID ' + prescription.patientID.toString() + '...');
    if(conn.Blockchain) {
        block_helper.write(
            prescription.patientID,
            prescription.prescriberID,
            prescription.dispenserID,
            prescription.drugID,
            prescription.quantity,
            prescription.fillDates,
            prescription.writtenDate,
            prescription.daysFor,
            prescription.refillsLeft,
            prescription.isCancelled,
            prescription.cancelDate
        ).then((_) => {
            return finish('Added prescription to chain.', true);
        }).catch((error) => {
            // Error in adding prescription to blockchain
            return finish('Error: ' + error.toString(), false);
        });
    }
    else {
        return finish('do nothing for add prescription with dummy data', true);
    }
});

/*
An api endpoint that returns all of the prescriptions associated with a patient ID
Roles:
    TODO: Role.Patient needs to be restricted further to one's own patientID only.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescriptions/1"
    To be used in Axois call:
        .get("api/v1/prescriptions/1")
Returns:
    A list of prescription objects each with fields: [
        prescriptionID, patientID, drugID, fillDates,
        writtenDate, quantity, daysFor, refillsLeft,
        prescriberID, dispenserID, cancelDate, drugName
    ]
*/
app.get('/api/v1/prescriptions/:patientID', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Dispenser, Role.Government]), (req,res) => {
    var patientID = parseInt(req.params.patientID);
    var handlePrescriptionsCallback = function(prescriptions) {
        var msg = 'Sent ' + prescriptions.length.toString() +
                    ' prescription(s) for patient ID ' + patientID.toString();

        // if no prescriptions for a patient ID, return early
        if (prescriptions.length === 0) {
            console.log(msg);
            res.json([]);
            return;
        }

        // Convert date integers to strings
        prescriptions = prescriptions.map(
            prescription => convertDatesToString(prescription)
        );

        // if no connection string (Travis testing), fill drugName with dummy info
        if (!conn.MySQL) {
            for (var i = 0; i < prescriptions.length; i++){
                prescriptions[i].drugName = "drugName";
            }
            res.json(prescriptions);
            return;
        }

        // Look up the drug names given the list of drugIDs in MySQL
        var drugIDs = prescriptions.map((prescription) => {
            return prescription.drugID;
        })

        mysql.getDrugNamesFromIDs(drugIDs, connection)
        .then((answer) => {
            for (var i = 0; i < prescriptions.length; i++){
                var drug = answer.rows.filter((row) => {
                    return (row.ID === prescriptions[i].drugID);
                });

                // Could be undefined on return
                if(drug.length !== 0) {
                    prescriptions[i].drugName = drug[0].NAME;
                }
                else {
                    prescriptions[i].drugName = "drugName";
                }
            }

            console.log(msg);
            res.json(prescriptions);
        })
        .catch((error) => {
            console.log("/api/v1/prescriptions: error: ", error);
            res.status(400).send({});
        });
    };

    if(conn.Blockchain){
        var field_patientID = 0;
        block_helper.read_by_value(field_patientID, patientID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        }).catch((error) => {
            console.log('error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching patientID.');
        });
    }
    else { // search prescriptions from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;

        var toSend = [];
        prescriptions.forEach(prescription => {
            if (prescription.patientID === patientID) toSend.push(prescription);
        });
        handlePrescriptionsCallback(toSend);
    }
});

/*
An api endpoint that returns a single prescription given a prescription ID
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescriptions/single/1"
    To be used in Axois call:
        .get("api/v1/prescriptions/single/1")
Returns:
    A prescription object each with fields: [
        prescriptionID,
        patientID,
        drugID,
        fillDates,
        writtenDate,
        quantity,
        daysFor,
        refillsLeft,
        prescriberID,
        dispenserID,
        cancelDate,
        drugName
    ]
Warning:
    no validation exists for blockchain index yet. See Issue #32 on GitHub.
*/
app.get('/api/v1/prescriptions/single/:prescriptionID', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Government, Role.Dispenser]), (req,res) => {
    var prescriptionID = parseInt(req.params.prescriptionID);
    var handlePrescriptionCallback = function(prescription) {
        // '==' catches both null and undefined
        if (prescription == null) {
            console.log('/api/v1/prescriptions/single: No ID match');
            res.status(400).send({});
            return;
        }

        // Convert date integers to strings
        prescription = convertDatesToString(prescription);

        // if no connection string (Travis testing), fill drugName with dummy info
        if (!conn.MySQL) {
            prescription.drugName = "drugName";
            console.log("/api/v1/prescriptions/single: Sent prescription with ID " + prescriptionID);
            res.json(prescription);
            return;
        }

        // Look up the drug name given the ID in MySQL
        mysql.getDrugNamesFromIDs([prescription.drugID], connection) // prescription.drugID
        .then((answer) => {
            if (answer.rows.length === 0) {
                prescription.drugName = 'drugName not found in Pharmacopoeia';
            } else {
                prescription.drugName = answer.rows[0].NAME;
            }

            console.log("/api/v1/prescriptions/single: Sent prescription with ID " + prescriptionID);
            res.json(prescription);
        })
        .catch((error) => {
            console.log("/api/v1/prescriptions/single: error: ", error);
            res.json({});
        });
    };

    if(conn.Blockchain){
        block_helper.read(prescriptionID)
        .then((answer) => {
            handlePrescriptionCallback(answer.prescription);
        }).catch((error) => {
            console.log('error: ', error);
            res.status(400).send('Error searching for prescription by prescriptionID.');
        });
    }
    else { // load prescription from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;

        var prescription = prescriptions.find( function(elem) {
            return elem.prescriptionID === prescriptionID;
        });
        handlePrescriptionCallback(prescription);
    }
});

// ------------------------
//        patients
// ------------------------

/*
About:
    An api endpoint that returns a list of patients given a first and
    last name. Patient data temporarily includes date of birth,
    first and last name, and patient ID. Names are converted to all lowercase.
    You can request patients by first name, last name, or both.
    TODO: restrict query to a single prescriber.
Examples:
    Directly in terminal:
        By both first and last name:
            >>> curl "http://localhost:5000/api/v1/patients?first=jacob&last=krantz"
        By just first name:
            >>> curl "http://localhost:5000/api/v1/patients?first=jacob"
        By just last name:
            >>> curl "http://localhost:5000/api/v1/patients?last=krantz"
    To be used in Axois call:
        .get("/api/v1/patients?first=jacob&last=krantz")
        .get("/api/v1/patients?first=jacob")
        .get("/api/v1/patients?last=krantz")

Returns:
    List of patients with all personal information:
    [
        {
            "first": "jacob",
            "last": "krantz",
            "patientID": 1,
            "dob": "10-05-1996"
        },
        ...
    ]

Relevant Express Docs:
    https://expressjs.com/en/api.html#req.query
*/
app.get('/api/v1/patients', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Government, Role.Dispenser]), (req,res) => {
    var first = req.query.first;
    var last = req.query.last;

    // will be replaced with DB call once we determine user auth.
    var all_patients = readJsonFileSync(
        __dirname + '/' + "dummy_data/patients.json").patients;

    // Searching for substrings
    var matchingPatients = all_patients.filter(function(elem) {
        if( first === undefined && last === undefined ){
            // if no query given, return all patients
            return true;
        } else if( last === undefined ){
            return (elem.first.includes(first.toLowerCase()));
        }
        else if( first === undefined ){
            return (elem.last.includes(last.toLowerCase()));
        }
        return (elem.first.includes(first.toLowerCase()))
                && (elem.last.includes(last.toLowerCase()));
    });

    // log the backend process to the terminal
    var msg = '/api/v1/patients: returning ' + matchingPatients.length.toString() + ' patient match(es) for';
    if(first !== undefined) msg += ' [first name: ' + first.toLowerCase() + ']';
    if(last !== undefined) msg += ' [last name: ' + last.toLowerCase() + ']';
    console.log(msg);

    res.json(matchingPatients);
});

/*
About:
    An api endpoint that returns the info about a patient given a specific
    patient ID. Patient data temporarily includes date of birth, first and
    last name, and patient ID.
    TODO: restrict query to a single prescriber.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/patients/1"
    To be used in Axois call:
        .get("/api/v1/patients/1")
Returns:
    Patient info object with all personal information:
    {
        "first": "jacob",
        "last": "krantz",
        "patientID": 1,
        "dob": "10-05-1996"
    }
*/
app.get('/api/v1/patients/:patientID', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Dispenser, Role.Government]), function(req,res) {

    var patientID = parseInt(req.params.patientID);
    var token = req.token;
    if(token.role === Role.Patient && patientID != token.sub){
        console.log("PatientIDs do not match...")
        res.status(400).send(false);
        return;
    }

    // will be replaced with DB call once we determine user auth.
    var all_patients = readJsonFileSync(
        __dirname + '/' + "dummy_data/patients.json").patients;

    var matchingPatient = all_patients.find(function(patient){
        return patient.patientID === patientID;
    });

    // log the backend process to the terminal
    var msg = '/api/v1/patients/:patientID: ';
    if(matchingPatient === undefined){
        msg += 'Returning no patient. No patientID matching \'' + patientID.toString() + '\'';
        matchingPatient = {};
    } else {
        msg += 'Returning patient info for patientID \'' + patientID.toString() + '\'';
    }

    console.log(msg);
    res.json(matchingPatient);
});

// ------------------------
//        users
// ------------------------

/*
About:
    The api endpoint to create a user.
    Expects a username, password and role.
Examples:
    curl 'http://localhost:5000/api/v1/users/add' -H 'Acceptapplication/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"username":"mdulin2","password":"jacob","role":"Patient"}'
Returns:
    Success or failure with message
Authentication:
    Admin only (Role.Admin)
*/
app.post('/api/v1/users/add', auth.checkAuth([]), (req,res) => {
    const userInfo = req.body;

    // validate fields exist that should
    fields = [
        userInfo.username,
        userInfo.password,
        userInfo.role
    ];
    fieldsSet = new Set(fields);
    if(fieldsSet.has(undefined) || fieldsSet.has(null)){
        console.log("/api/v1/users/add: error: Not all fields");
        res.status(400).send(false);
        return;
    }

    // Salts: Making the random table attack near impossible.
    var salt = crypto.randomBytes(64).toString('base64');

    // Hash the password
    var hashedPassword = pbkdf2.pbkdf2Sync(userInfo.password, salt, 1, 32, 'sha512').toString('base64');

    // Create user and add salt.
    mysql.insertUser(userInfo.username, hashedPassword, userInfo.role, connection)
    .then(result => {
        const id = result.rows[0].insertId;
        console.log(id);
        mysql.insertSalt(id, salt, connection)
        .then( () => {
            res.status(200).send(true);
        });
    })
    .catch((error) => {
        console.log("/api/v1/users/add: error: ", error);
        res.status(400).send(false);
    });
});

/*
About:
    The api endpoint to login as a user.
    Expects a username and password.
Examples:
    curl 'http://localhost:5000/api/v1/users/login' -H 'Acceptapplication/json, text/plain, /*' -H 'Content-Type: application/json;charset=utf-8' --data '{"username":"mdulin","password":"jacobispink"}'
Returns:
    A failure message or a auth to authenticate to the next page.
*/
app.post('/api/v1/users/login', (req, res) => {
    const userInfo = req.body;

    // validate fields exist that should
    fields = [
        userInfo.username,
        userInfo.password,
    ];
    fieldsSet = new Set(fields);
    if(fieldsSet.has(undefined) || fieldsSet.has(null)){
        console.log("/api/v1/users/login: error: Missing Fields");
        res.status(400).send(false);
        return;
    }

    // Validate the logged in user
    mysql.getSaltByUsername(userInfo.username, connection)
    .then(salt => {

        if(salt.rows.length === 0){
            console.log("/api/v1/users/login: error: User salt not found.");
            res.status(400).send(false);
            return;
        }

        // Salt the password with the user specific salt
        salt = salt.rows[0].salt;
        var hashedPassword = pbkdf2.pbkdf2Sync(userInfo.password, salt, 1, 32, 'sha512').toString('base64');

        // See if the password matches
        mysql.getUserValidation(userInfo.username, hashedPassword, connection)
        .then(user => {
            if(user.rows.length === 0){
                console.log('/api/v1/users/login: Failed attempt');
                res.status(400).send(false);
                return;
            }

            // Login is complete. Send back a auth for the user to advance on.
            var token = auth.createToken(user.rows[0].id, user.rows[0].role);
            res.json(token);
        });

    }).catch(error => {
        console.log(error);
    });
});

/*
About:
    On the frontend, each time a web request is made for a webpage or api the  token needs to be verified. This reauth will verify the token, then send the user a new token.
Example: NOTE - The 'jwt' must be a valid jwt token for the user.
    curl "http://localhost:5000/api/v1/users/reauth" --cookie 'jwt=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUGF0aWVudCIsInN1YiI6IjEyIiwiaWF0IjoxNTUxMzMzNTYwLCJleHAiOjE1NTEzMzcxNjB9.dR-JZF1VBQU7jEU9nROa_Ky8X7U5w5_H3m2ZpT61_eakRriHMPAQOANLbIVuXfZFeXAaBD0VYM2h4Dmj54WW-L7yn5PJqnlEOJzS1ut4-B1NkfgIXJEdUIFjIedNpkJ9nfN7G7_kSjJ3jpA-pqV8CZHtgINUQggbxp_UrAJd7iUN3Fa58hrQJ3_40ge7seLgI15LLIFUOQV0JQR3VbSPUL5wfZI6XKEXAeAIhuz7YXPxodPZVAxk6a0h4jmfnaxWD777vdiaW_7djYUlIwVD3OWcOGV4EojcIYvUyM8c9MrsRij1LNHEMBr5BuElYcV2ZqgxKE3ek9k1gyu3pMKpOQ'
Returns:
    jwt token or error
*/
app.get('/api/v1/users/reauth', auth.checkAuth([Role.Patient, Role.Prescriber, Role.Dispenser, Role.Government]), (req,res) => {
    var token = auth.createToken(req.token.sub, req.token.role);
    res.status(200).send(token);
});

// ------------------------
//       dispensers
// ------------------------

/*
About:
    An api endpoint that returns all related prescriptions for a given dispenserID.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/prescriptions/all/1"
    To be used in Axois call:
        .get("/api/v1/dispensers/prescriptions/1")
Returns:
    list<Prescription>
*/
app.get('/api/v1/dispensers/prescriptions/all/:dispenserID', auth.checkAuth([Role.Dispenser, Role.Government]), (req, res) => {
    var dispenserID = parseInt(req.params.dispenserID);
    var handlePrescriptionsCallback = function(prescriptions) {
        // take only prescriptions with matching dispenserID
        prescriptions = prescriptions.filter(
            prescription => prescription.dispenserID === dispenserID
        );

        // Convert date integers to strings
        prescriptions = prescriptions.map(
            prescription => convertDatesToString(prescription)
        );

        console.log('Sending ' + prescriptions.length.toString()
                        + ' prescription(s) related to dispenserID ' + dispenserID.toString());
        res.status(200).send(prescriptions);
    }
    // Error if dispenser ID is null or undefined
    if(dispenserID == null) {
        console.log('/api/v1/dispensers/prescriptions/:dispenserID: No ID match');
        res.status(400).send([]);
        return;
    }

    if(conn.Blockchain) {
        var field_dispenserID = 2;
        block_helper.read_by_value(field_dispenserID, dispenserID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        })
        .catch((error) => {
            console.log('error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching dispenserID.');
        });
    }
    else { // search from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
        handlePrescriptionsCallback(prescriptions);
    }
});

/*
About:
    An api endpoint that returns all historical prescriptions for a given dispenserID.
    A prescription is historical if it is either cancelled or has no refills left.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/prescriptions/historical/1"
    To be used in Axois call:
        .get("/api/v1/dispensers/prescriptions/historical/1")
Returns:
    list<Prescription>
*/
app.get('/api/v1/dispensers/prescriptions/historical/:dispenserID', auth.checkAuth([Role.Dispenser, Role.Government]), (req, res) => {
    var dispenserID = parseInt(req.params.dispenserID);
    var handlePrescriptionsCallback = function(prescriptions) {
        // only take historical prescriptions with dispenserID
        prescriptions = prescriptions.filter(
            prescription =>
                prescription.dispenserID === dispenserID &&
                (prescription.cancelDate > 0 || prescription.refillsLeft < 1) // there is no cancel date if cancelDate is 0 or -1
        );

        // Convert date integers to strings
        prescriptions = prescriptions.map(
            prescription => convertDatesToString(prescription)
        );

        console.log('Sending ' + prescriptions.length.toString()
                        + ' historical prescription(s) related to dispenserID ' + dispenserID.toString());
        res.status(200).send(prescriptions);
    }
    
    // Error if dispenser ID is null or undefined
    if(dispenserID == null) {
        console.log('/api/v1/dispensers/prescriptions/historical/:dispenserID: No ID match');
        res.status(400).send([]);
        return;
    }

    if(conn.Blockchain) {
        var field_dispenserID = 2;
        block_helper.read_by_value(field_dispenserID, dispenserID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        })
        .catch((error) => {
            console.log('error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching dispenserID.');
        });
    }
    else { // search from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
        handlePrescriptionsCallback(prescriptions);
    }
});

/*
About:
    An api endpoint that returns all open prescriptions for a given dispenserID.
    A prescription is open if it can be fulfilled (not cancelled and can be refilled).
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/prescriptions/open/1"
    To be used in Axois call:
        .get("/api/v1/dispensers/prescriptions/open/1")
Returns:
    list<Prescription>
*/
app.get('/api/v1/dispensers/prescriptions/open/:dispenserID', auth.checkAuth([Role.Dispenser, Role.Government]), (req, res) => {
    var dispenserID = parseInt(req.params.dispenserID);
    var handlePrescriptionsCallback = function(prescriptions) {
        // only take open prescriptions with dispenserID
        prescriptions = prescriptions.filter(
            prescription => 
                prescription.dispenserID === dispenserID
                && prescription.refillsLeft > 0
                && prescription.cancelDate < 1 // there is no cancel date if cancelDate is 0 or -1
        );

        // Convert date integers to strings
        prescriptions = prescriptions.map(
            prescription => convertDatesToString(prescription)
        );

        console.log('Sending ' + prescriptions.length.toString()
                        + ' open prescription(s) related to dispenserID ' + dispenserID.toString());
        res.status(200).send(prescriptions);
    }

    // Error if dispenser ID is null or undefined
    if(dispenserID == null) {
        console.log('/api/v1/dispensers/prescriptions/open/:dispenserID: No ID match');
        res.status(400).send([]);
        return;
    }

    if(conn.Blockchain) {
        var field_dispenserID = 2;
        block_helper.read_by_value(field_dispenserID, dispenserID)
        .then((answer) => {
            handlePrescriptionsCallback(answer.prescriptions);
        })
        .catch((error) => {
            console.log('error: ', error);
            res.status(400).send('Error in searching blockchain for prescriptions matching dispenserID.');
        });
    }
    else { // search from dummy data
        var prescriptions = readJsonFileSync(
            __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;
        handlePrescriptionsCallback(prescriptions);
    }
});

/*
About:
    An api endpoint that returns a list of all dispensers given a name to match on.
    String matching is case insensitive.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/dispensers/walgreens"
    To be used in Axois call:
        .get("/api/v1/dispensers/walgreens")
Returns:
    [
        {
            dispenserID (int),
            name (string),
            location (string),
            phone (int)
        },
        ...
    ]
*/
app.get('/api/v1/dispensers/:name', auth.checkAuth([Role.Prescriber, Role.Dispenser, Role.Government]), (req, res) => {
    var name = req.params.name;

    // if dispenser ID is null or undefined, return all
    if(name == null) {
        console.log('/api/v1/dispensers/prescriptions/:dispenserID: returning all dispensers');
        res.status(200).send([]);
        return;
    }

    var dispensers = readJsonFileSync(
        __dirname + '/' + "dummy_data/dispensers.json").dispensers;

    dispensers = dispensers.filter(function(elem) {
        // if no query given, return all dispensers
        if(name === undefined) return true;

        // case insensitive: match substrings in dispenser name
        return elem.name.toLowerCase().includes(name.toLowerCase());
    });

    console.log('/api/v1/dispensers/prescriptions/:dispenserID: returning ' 
                    + dispensers.length.toString() + ' dispensers.');
    res.status(200).send(dispensers);
});

// ------------------------
//          Misc
// ------------------------

// Handles any requests that don't match the ones above
app.get('*', (req,res) => {
    res.status(404).send('Not found');
})

// use the environment variable if set, otherwise use port 5000
var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log('App is listening on port ' + port);
});

module.exports = server;
