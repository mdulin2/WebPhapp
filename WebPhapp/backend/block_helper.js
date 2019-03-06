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

/*
Estabishes the patient and account to work from.
Can be customized for different users down the road.
Returns:
    {
        patient (web3 contract),
        account (web3 account),
        web3 (general web3 object)
    }
*/
var connectToChain = async function() {
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
    let patient = new web3.eth.Contract(
        contracts.abi,
        null,
        {data: contracts.bytecode}
    );

    patient.options.address = fs.readFileSync(
        "../PharmaChain/patient_contract_address.txt"
    ).toString('ascii');

    return {
        patient: patient,
        account: account,
        web3: web3
    };
};

// Returns the Integer number of prescriptions stored on the blockchain.
var getChainLength = async function() {
    var blockchain = await connectToChain();
    let length = await blockchain.patient.methods.getDrugChainLength().call({from: blockchain.account});
    return parseInt(length);
};

module.exports = {

    /*
    This function takes an index and returns a prescription from the blockchain.
    Args:
        index: (int), index of prescription on the blockchain
    Returns:
        { prescription }
    */
    read: async function(chainIndex) {
        var blockchain = await connectToChain();

        var error;
        let prescription = {};
        try {
            let values = await blockchain.patient.methods.getPrescription(chainIndex).call({from: blockchain.account});
            prescription = valuesToPrescription(values, chainIndex);
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
        var blockchain = await connectToChain();
        
        var prescriptions = [];
        var error;
        try {
            // check that field input is valid
            if(field_i > 9 || field_i < 0) {
                throw new Error("'field_i' is an index and must be within 0-9.");
            }

            for(i = 0; i < await blockchain.patient.methods.getDrugChainLength().call({from: blockchain.account}); i++){
                let values = await blockchain.patient.methods.getPrescription(i).call({from: blockchain.account});
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
    },

    /*
    This function creates a new prescription on the blockchain
    Args:
        patientID, prescriberID, dispenserID, drugID,
        quantity, fillDates, writtenDate, daysValid,
        refills, isCancelled, cancelDate
    Returns:
        Transaction object
    Example: 
        write(0, 1, 2, 14, '300MG', 1542357074, 200, 8, false, 0)  
    */
    write: async function(patientID, prescriberID, dispenserID, drugID, quantity, fillDates, writtenDate, daysValid, refills, isCancelled, cancelDate) {
        var blockchain = await connectToChain();

        // Set up prescription data to be sent.
        let transaction = await blockchain.patient.methods.addPrescription(
            patientID,
            prescriberID,
            dispenserID,
            drugID,
            quantity,
            fillDates,
            writtenDate,
            daysValid,
            refills,
            isCancelled,
            cancelDate
        );
        
        // Submitting prescription transaction.
        let encodedTransaction = transaction.encodeABI();
        let block = await blockchain.web3.eth.sendTransaction({
            data: encodedTransaction,
            from: blockchain.account,
            to: blockchain.patient.options.address,
            gas: 50000000
        });
        
        // Return Transaction object containing transaction hash and other data
        return block;
    },

    /*
    This function redeems a prescription on the blockchain,
	decrementing refills left, and adding a new date to fulfillmentDates
    Args:
        chainIndex (int)
        date (int)
    Returns:
        Transaction object
    Example:
        redeem(0, 123456543)
    */
    redeem: async function(chainIndex, date) {
        var blockchain = await connectToChain();
        var error;
        var block;

        try {
            // Ensures that a neither cancelled prescription nor one without refills left can be filled.
            let values = await blockchain.patient.methods.getPrescription(chainIndex).call({from: blockchain.account});
            let prescription = valuesToPrescription(values, chainIndex);
            if(prescription.cancelDate > 0) {
                throw new Error('cannot redeem a cancelled prescription.');
            }
            if(prescription.refillsLeft < 1) {
                throw new Error('cannot redeem a prescription with no refills left.');
            }

            let transaction = await blockchain.patient.methods.redeemPrescription(chainIndex, date);
            // Submitting prescription transaction.
            let encodedTransaction = transaction.encodeABI();
            block = await blockchain.web3.eth.sendTransaction({
                data: encodedTransaction,
                from: blockchain.account,
                to: blockchain.patient.options.address,
                gas: 50000000
            });
        }
        catch(err) {
            error = err;
        }

        return new Promise((resolve, reject) => {
            if(error) reject(error);
            resolve(block);
        });
    },

    /*
    This function cancels a prescription on the blockchain,
        preventing it from being updated or altered
    Args:
        chainIndex (int)
        date (int)
    Returns:
        Transaction object.
    Example:
        cancel(0, 123456543)
    */
    cancel: async function(chainIndex, date) {
        var blockchain = await connectToChain();
        var error;
        var block;

        try {
            let transaction = await blockchain.patient.methods.cancelPrescription(chainIndex, date);
            // Submitting prescription transaction.
            let encodedTransaction = transaction.encodeABI();
            block = await blockchain.web3.eth.sendTransaction({
                data: encodedTransaction,
                from: blockchain.account,
                to: blockchain.patient.options.address,
                gas: 50000000
            });
        }
        catch(err) {
            error = err;
        }

        return new Promise((resolve, reject) => {
            if(error) reject(error);
            resolve(block);
        });
    },

    /*
    This function updates a prescription on the blockchain,
        altering its dispenserID, quantity, daysValid, and refillsLeft
    Args:
        chainIndex (int)
        dispenserID (int)
        quantity (string)
        daysFor (int)
        refillsLeft (int)
    Returns:
        Transaction Object.
    Example:
        update(0, 2, '300MG', 16, 1)
    Note:
        we have a daysFor vs daysValid problem here
    */
    update: async function(chainIndex, dispenserID, quantity, daysValid, refillsLeft) {
        var blockchain = await connectToChain();
        var error;
        var block;
        try {
            // Ensures that a filled or cancelled prescription cannot be altered.
            let values = await blockchain.patient.methods.getPrescription(chainIndex).call({from: blockchain.account});
            let prescription = valuesToPrescription(values, chainIndex);
            if(prescription.cancelDate > 0 || prescription.fillDates[0] > 0) {
                throw new Error('cannot change a cancelled or already filled prescription.');
            }

            // Only call blockchain function if something is being updated
            if(!(prescription.dispenserID === dispenserID) || !(prescription.quantity === quantity)
                    || !(prescription.daysFor === daysValid) || !(prescription.refillsLeft === refillsLeft)) {

                let transaction = await blockchain.patient.methods.updatePrescription(
                    chainIndex,
                    dispenserID,
                    quantity,
                    daysValid,
                    refillsLeft
                );
    
                let encodedTransaction = transaction.encodeABI();
                block = await blockchain.web3.eth.sendTransaction({
                    data: encodedTransaction,
                    from: blockchain.account,
                    to: blockchain.patient.options.address,
                    gas: 50000000
                });
            }
        }
        catch(err) {
            error = err;
        }
        return new Promise((resolve, reject) => {
            if(error) reject(error);
            resolve(block);
        });
    },

    /*
    Checks the length of the blockchain to determine if the given chainIndex is valid for an existing prescription.
    Args:
        chainIndex (int)
    */
    verifyChainIndex: async function(chainIndex) {
        var blockchain = await connectToChain();
        let chainLength;
        let error;

        try {
            chainLength = await blockchain.patient.methods.getDrugChainLength().call({from: blockchain.account});
            if(chainIndex >= parseInt(chainLength)) {
                throw new Error('verifyChainIndex: given chainIndex is too high to be a valid index on the blockchain.');
            }
        } catch (err) {
            error = err;
        }

        return new Promise((resolve, reject) => {
            if(error) reject(error);
            resolve(true);
        });
    }
}
