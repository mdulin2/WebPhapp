// Helper functions to work with the blockchain

let fs = require("fs");
let Web3 = require("web3");
let net = require("net");

//Converts a blockchain values object to a prescription
var valuesToPrescription = function(values, prescriptionID) {
    return {
        prescriptionID: prescriptionID,
        patientID:      parseInt(values['0']),
        prescriberID:   parseInt(values['1']),
        dispenserID:    parseInt(values['2']),
        drugID:         parseInt(values['3']),
        quantity:                values['4'],
        fillDates:               values['5'].map(date => parseInt(date)),
        writtenDate:    parseInt(values['6']),
        daysFor:        parseInt(values['7']),
        refillsLeft:    parseInt(values['8']),
        cancelDate:     parseInt(values['10'])
    };
};

module.exports = {

    /*
    This function takes an index and returns a prescription from the blockchain.
    Args:
        index: (int), index of prescription on the blockchain
    Returns:
        { prescription }
    */
    read: async function(index_value) {
        // Connecting to the node 1. Will want to change to IPC connection eventually. 
        let web3 = new Web3(
            new Web3.providers.HttpProvider("http://10.50.0.2:22000", net)
        );

        // Get account information
        let account = await web3.eth.personal.getAccounts();
        account = account[0];

        // Sets up contract requirements.
        let source = fs.readFileSync('../PharmaChain/build/contracts/Patient.json'); 
        let contracts = JSON.parse(source);
        let Patient = new web3.eth.Contract(
            contracts.abi,
            null,
            {data: contracts.bytecode}
        );

        Patient.options.address = fs.readFileSync(
            "../PharmaChain/patient_contract_address.txt"
        ).toString('ascii');

        var error;
        let prescription = {};
        try {
            let values = await Patient.methods.getPrescription(index_value).call({from: account});
            prescription = valuesToPrescription(values, index_value);
        }
        catch(err) {
            error = err;
        }

        return new Promise((resolve, reject) => {
            if(error) reject(error);
            resolve({prescription});
        });
    },

    /*
    This function takes a field index and a value, and returns prescriptions
    that have the give value at the field index.
    Args:
        field_i (int): 
                0:patientID,
                1:prescriberID,
                2:dispenserID,
                3:drugID,
                4:drugQuantity,
                5:dateWritten,
                6:daysValid,
                7:refillsLeft,
                8:isCancelled,
                9:cancelDate
    Returns:
        list of prescriptions that satisfy the query
    Example:
        read_by_value(0, 0)
            This example will search for prescriptions with patientID = 0.
            It will return all found prescriptions that match this criteria.
    */
    read_by_value: async function(field_i, value_i) {

        let web3 = new Web3(
            new Web3.providers.HttpProvider("http://10.50.0.2:22000", net)
        );

        
        // get account information
        let account = await web3.eth.personal.getAccounts();
        account = account[0];

        // Sets up contract requirements.
        let source = fs.readFileSync('../PharmaChain/build/contracts/Patient.json'); 
        let contracts = JSON.parse(source);
        let Patient = new web3.eth.Contract(
            contracts.abi,
            null,
            {data: contracts.bytecode}
        );

        Patient.options.address = fs.readFileSync(
            "../PharmaChain/patient_contract_address.txt"
        ).toString('ascii');
        
        var prescriptions = [];
        var error;
        try {
            // check that field input is valid
            if(field_i > 9 || field_i < 0) {
                throw new Error("'field_i' is an index and must be within 0-9.");
            }

            for(i = 0; i < await Patient.methods.getDrugChainLength().call({from: account}); i++){
                let values = await Patient.methods.getPrescription(i).call({from: account});
                if(values[field_i] == value_i) {
                    prescriptions.push(valuesToPrescription(values, i));
                }
            }
        }
        catch(err) {
            error = err;
        }

        return new Promise((resolve, reject) => {
            if(error) reject(error);
            resolve({prescriptions});
        });
    }
}
