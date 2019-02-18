// Helper functions to work with the blockchain

let fs = require("fs");
let Web3 = require("web3");
let net = require("net");

module.exports = {

    /*
    This function takes an index and returns a prescription from the drugChain.
    Args:
        index: (int), idnex of prescription on the blockchain
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
            prescription.prescriptionID = index_value;
            prescription.patientID      = parseInt(values['0']);
            prescription.prescriberID   = parseInt(values['1']);
            prescription.dispenserID    = parseInt(values['2']);
            prescription.drugID         = parseInt(values['3']);
            prescription.quantity       = values['4'];
            prescription.fillDates      = values['5'].map(date => parseInt(date));
            prescription.writtenDate    = parseInt(values['6']);
            prescription.daysFor        = parseInt(values['7']);
            prescription.refillsLeft    = parseInt(values['8']);
            prescription.cancelDate     = parseInt(values['10']);
        }
        catch(err) {
            error = err;
        }

        return new Promise((resolve, reject) => {
            if(error) reject(error);
            resolve({prescription});
        });
    }
}