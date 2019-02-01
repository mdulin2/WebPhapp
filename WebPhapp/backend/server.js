const express = require('express');
const path = require('path');
var fs = require("fs");
var conn = require('./connections.js') // private file not under VC.

const app = express();

// establish a connection to the remote MySQL DB
var mysql = require('mysql')
var connection = mysql.createConnection(conn);

// Given a list of drugIDs, looks up drug names in the MySQL DB.
// Args: drugIDs list <(int or string)>
// Returns: Promise
function getDrugNamesFromIDs(drugIDs){
    var q = `
        SELECT ID, NAME
        FROM seniordesign1.pharmacopeia
        WHERE ID IN (` + drugIDs.toString() + `)
    `;

    return new Promise((resolve, reject) => {
        connection.query(q, (error, rows, fields) => {
            if (error) reject(error);
            resolve({rows, fields});
        });
    });
}

// JSON reader to read in dummy data
function readJsonFileSync(filepath, encoding){
    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// An api endpoint that returns a short list of items.
// Used for frontend testing. To be removed when ready.
app.get('/api/v1/list', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

/*
An api endpoint that returns all of the prescriptions associated with a patient ID
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescriptions/01"
    To be used in Axois call:
        .get("api/v1/prescriptions/01")
Returns:
    A list of prescription objects each with fields: [
        prescriptionID, patientID, drugID, fillDates, 
        writtenDate, quantity, daysFor, refillsLeft, 
        prescriberID, dispenserID, cancelled, cancelDate, drugName
    ]
*/
app.get('/api/v1/prescriptions/:patientID', (req,res) => {
    var patientID = req.params.patientID;
    var prescriptions = readJsonFileSync(
        __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;

    var toSend = [];
    prescriptions.forEach(prescription => {
        if ( prescription.patientID === patientID ){
            toSend.push(prescription);
        }
    });

    // if no prescriptions for a patient ID, return early
    var msg = 'Sent ' + toSend.length.toString() + 
                ' prescription(s) for patient ID ' + patientID.toString();
    if(toSend.length === 0){
        console.log(msg);
        res.json([]);
        return;
    }

    var drugIDs = toSend.map((prescription) => {
        return prescription.drugID;
    })

    // Look up the drug names given the list of drugIDs in MySQL
    getDrugNamesFromIDs(drugIDs)
    .then((answer) => {
        for (var i = 0; i < toSend.length; i++){
            var drug = answer.rows.filter((r) => {
                return (r.ID === toSend[i].drugID);
            })[0];
            toSend[i].drugName = drug.NAME;
        }

        console.log(msg);
        res.json(toSend);
    })
    .catch((error) => {
        console.log("/api/v1/prescriptions: error: ", error);
        res.json({});
    });
});

/*
An api endpoint that returns the prescription associated with a
given prescription ID.
Examples:
    Directly in terminal:
        >>> curl "http://localhost:5000/api/v1/prescriptions/single/0002"
    To be used in Axois call:
        .get("/api/v1/prescriptions/single/0002")
Returns:
    A single prescription object with fields: [
        prescriptionID, patientID, drugID, fillDates, 
        writtenDate, quantity, daysFor, refillsLeft, 
        prescriberID, dispenserID, cancelled, cancelDate, drugName
    ]
*/
app.get('/api/v1/prescriptions/single/:prescriptionID', (req,res) => {
    var prescriptionID = req.params.prescriptionID;
    var pres = readJsonFileSync(
        __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;

    var p = pres.find( function(elem) {
        return elem.prescriptionID === prescriptionID;
    });

    // '==' catches both null and undefined 
    if (p == null) {
        console.log('/api/v1/prescriptions/single: No ID match');
        res.json({});
        return;
    }
    
    // Look up the drug name given the ID in MySQL
    getDrugNamesFromIDs([p.drugID])
    .then((answer) => {
        if (answer.rows.length === 0) {
            p.drugName = '';
        } else {
            p.drugName = answer.rows[0].NAME;
        }
        
        console.log("/api/v1/prescriptions/single: Sent prescription with ID " + prescriptionID);
        res.json(p);
    })
    .catch((error) => {
        console.log("/api/v1/prescriptions/single: error: ", error);
        res.json({});
    });
});

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
    [{"first":"jacob","last":"krantz","patient_id":"01","dob":"10-05-1996"}, { ... }]

Relevant Express Docs:
    https://expressjs.com/en/api.html#req.query
*/
app.get('/api/v1/patients', (req,res) => {
    var first = req.query.first;
    var last = req.query.last;

    // will be replaced with DB call once we determine user auth.
    var all_patients = readJsonFileSync(
        __dirname + '/' + "dummy_data/patients.json").patients;

    var matchingPatients = all_patients.filter(function(elem) {
        if( last === undefined ){
            return (elem.first === first.toLowerCase());
        }
        else if( first === undefined ){
            return (elem.last === last.toLowerCase());
        }
        return (elem.first === first.toLowerCase())
                && (elem.last === last.toLowerCase());
    });

    // log the backend process to the terminal
    var msg = '/api/v1/patients: returning ' + matchingPatients.length.toString() + ' patient match(es) for';
    if(first !== undefined) msg += ' [first name: ' + first.toLowerCase() + ']';
    if(last !== undefined) msg += ' [last name: ' + last.toLowerCase() + ']';
    console.log(msg);

    res.json(matchingPatients);
});

// get the index
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

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
