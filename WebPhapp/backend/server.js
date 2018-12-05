const express = require('express');
const path = require('path');
var fs = require("fs");
let Web3 = require("web3");
let net = require("net");

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
app.get('/api/v1/prescriptions/:patientID', async (req,res) => {
    var toSend = [];
    
    let data = await read(req.params.patientID); 
    let ret = {
        "prescriptionID": req.params.patientID,
        "patientID": data[0].toString(),
        "drugID": data[3].toString(),
        "filled": data[5].length > 0,
        "fillDates": [],//data[5], // map each to str
        "writtenDate": data[6].toString(),
        "oldestFillDate": data[5][data[5].length-1],
        "quantity": data[4],
        "daysFor": data[7],
        "refillsLeft": data[8],
        "prescriberID": data[1].toString(),
        "dispenserID": data[2].toString(),
        "cancelled": data[9],
        "cancelDate": data[10].toString()
      }
    console.log(ret);
    res.json([ret]);

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

async function read(index_value){

    // Connecting to the node 1. Will want to change to IPC connection eventually. 
    let web3 = new Web3( new Web3.providers.HttpProvider("http://10.50.0.2:22000", net));

    // Get account information
    let account = await web3.eth.personal.getAccounts();
    account = account[0];

    // Sets up contract requirements.
    let source = fs.readFileSync('/home/osboxes/PharmaChain/build/contracts/Patient.json'); 
    let contracts = JSON.parse(source);
    let code = contracts.bytecode;
    let abi = contracts.abi
    let Patient = new web3.eth.Contract(abi, null,{
        data: code,
    });

    Patient.options.address = fs.readFileSync("/home/osboxes/PharmaChain/patient_contract_address.txt").toString('ascii');

    let values = await Patient.methods.getPrescription(index_value).call({from: account});
    return values;

}

module.exports = server;
