const express = require('express');
const path = require('path');
var fs = require("fs");

const app = express();

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

// An api endpoint that returns a short list of items
app.get('/api/v1/list', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// An api endpoint that returns all of the prescriptions
// associated with a patient ID
// example: http://localhost:5000/api/v1/prescriptions/01
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

    res.json(toSend);
    if (toSend.length === 0){
        console.log('Sent empty list: no prescriptions for given patient ID');
    } else {
        console.log('Sent prescriptions');
    }
});

// An api endpoint that returns the prescription associated with a
// given prescription ID.
// example: http://localhost:5000/api/v1/prescriptions/single/0002
app.get('/api/v1/prescriptions/single/:prescriptionID', (req,res) => {
    var prescriptionID = req.params.prescriptionID;
    var pres = readJsonFileSync(
        __dirname + '/' + "dummy_data/prescriptions.json").prescriptions;

    var p = pres.find( function(elem) {
        return elem.prescriptionID === prescriptionID;
    });

    // '==' catches both null and undefined 
    if (p == null) {
        console.log('Sent empty prescription: no ID match');
        p = {};
    } else {
        console.log("Sent single prescription with ID " + prescriptionID);
    }

    res.json(p);
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
