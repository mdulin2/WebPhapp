//Helper Functions to work with the blockchain

let fs = require("fs");
let Web3 = require("web3");
let net = require("net");

/* Function to deploy a new version of the patient contract.
    Returns the memory address of the newly deployed contract,
    and writes the address to a txt file.
 */

async function deploy(){

    // This is actually connecting to the node!
	let web3 = new Web3( new Web3.providers.HttpProvider("http://10.50.0.2:22000", net));

    
    // get account information
    let account = await web3.eth.personal.getAccounts();
    account = account[0];

    // sets up deployment needs
    let source = fs.readFileSync('./build/contracts/Patient.json'); 
    let contracts = JSON.parse(source);
    let code = contracts.bytecode;
    let abi = contracts.abi;
    let Patient = new web3.eth.Contract(abi, null,{
        data: code
    });

    let contractInstance = await Patient.deploy().send({
        from: account,
        gasPrice: 0,
        gas: 1000000000
    });

    console.log(contractInstance.options.address);

    fs.writeFile("patient_contract_address.txt", contractInstance.options.address, () => {});
    process.env.CONTRACT_ADDRESS = contractInstance.options.address;
    return contractInstance.options.address;
}

/*  This function creates a new prescription on the drugChain
    User input: prescription arguments
    Argument list: patientID, prescriberID, dispenserID, drugID, drugQuantity, dateWritten, daysValid, refillsLeft, isCancelled, cancelDate
    Example usage: node write_prescription.js 0 1 2 34 '300MG' 1542357074 200 8 false 0   
*/

async function write(patientID, prescriberID, dispenserID, drugID, drugQuantity, fulfillmentDates, dateWritten, daysValid, refillsLeft, isCancelled, cancelDate){

    // Connecting to the node 1. Will want to change to IPC connection eventually. 
	let web3 = new Web3( new Web3.providers.HttpProvider("http://10.50.0.2:22000", net));
    
    // Get account information
    let account = await web3.eth.personal.getAccounts();
    account = account[0];

    // Sets up deployment requirements
    let source = fs.readFileSync('./build/contracts/Patient.json'); 
    let contracts = JSON.parse(source);
    let code = contracts.bytecode;
    let abi = contracts.abi;
    let Patient = new web3.eth.Contract(abi, null,{
        data: code,
    });

    // Set up prescription data to be sent.
    Patient.options.address = fs.readFileSync("./patient_contract_address.txt").toString('ascii');
    let transaction = await Patient.methods.addPrescription(patientID, prescriberID, dispenserID, drugID, drugQuantity,
                                                         fulfillmentDates, dateWritten, daysValid, refillsLeft, isCancelled, cancelDate);
    
    // Submitting prescription transaction.
    let encoded_transaction = transaction.encodeABI();
    let block = await web3.eth.sendTransaction({
        data: encoded_transaction,
        from: account,
        to: Patient.options.address,
        gas: 50000000
    });
    
    // Return Transaction object containing transaction hash and other data
    return block;

}


/*  This function takes an index and returns a prescription from the drugChain.
    User input: prescription index on the drugChain.
    Argument list: index
    Example usage: node read_prescrip_index.js 0 
*/

async function read(index_value){

    // Connecting to the node 1. Will want to change to IPC connection eventually. 
	let web3 = new Web3( new Web3.providers.HttpProvider("http://10.50.0.2:22000", net));

    // Get account information
    let account = await web3.eth.personal.getAccounts();
    account = account[0];

    // Sets up contract requirements.
    let source = fs.readFileSync('./build/contracts/Patient.json'); 
    let contracts = JSON.parse(source);
    let code = contracts.bytecode;
    let abi = contracts.abi
    let Patient = new web3.eth.Contract(abi, null,{
        data: code,
    });

    Patient.options.address = fs.readFileSync("./patient_contract_address.txt").toString('ascii');

    let values = await Patient.methods.getPrescription(index_value).call({from: account});
    console.log(values);
    return values;

}


/*  This function takes a type and a value, and returns prescriptions
    that have a type, of the first index and, a value of the second index.
    

    Index meaning: 0:patientID, 1:prescriberID, 2:dispenserID, 3:drugID, 4:drugQuantity, 5:dateWritten, 6:daysValid, 7:refillsLeft, 8:isCancelled, 9:cancelDate


    Example usage: node read_prescription_type_value.js 0 0
    
    This example will search the blockchain for prescriptions with 
    patientID = 0. It will return all found prescriptions that match this criteria.

*/
async function read(type_i, value_i){

    // This is actually connecting to the node!
	let web3 = new Web3( new Web3.providers.HttpProvider("http://10.50.0.2:22000", net));

    
    // get account information
    let account = await web3.eth.personal.getAccounts();
    account = account[0];

    // sets up deployment needs
    let source = fs.readFileSync('./build/contracts/Patient.json'); 
    let contracts = JSON.parse(source);
    let code = contracts.bytecode;
    let abi = contracts.abi
    let Patient = new web3.eth.Contract(abi, null,{
        data: code,
    });

    Patient.options.address = fs.readFileSync("./patient_contract_address.txt").toString('ascii');

    let type = type_i
    let comparison_value = value_i
    
    for(i = 0; i < await Patient.methods.getDrugChainLength().call({from: account}); i++){
        let values = await Patient.methods.getPrescription(i).call({from: account});
        if(values[type] == comparison_value){
            console.log(values);
        }
    }

}


/*  This function updates an existing prescription on the drugChain
    User input: prescription arguments
    Argument list: drugChainIndex, dispenserID, drugQuantity, daysValid, isCancelled, cancelDate
    Example usage: node update_prescription.js 0 1 2 4 true 8    
*/

async function update( drugChainIndex, dispenserID,drugQuantity, fulfillmentDate, daysValid, isCancelled, cancelDate){

    // Connecting to the node 1. Will want to change to IPC connection eventually. 
	let web3 = new Web3( new Web3.providers.HttpProvider("http://10.50.0.2:22000", net));
    
    // Get account information
    let account = await web3.eth.personal.getAccounts();
    account = account[0];

    // Sets up deployment requirements
    let source = fs.readFileSync('/home/osboxes/PharmaChain/build/contracts/Patient.json'); 
    let contracts = JSON.parse(source);
    let code = contracts.bytecode;
    let abi = contracts.abi;
    let Patient = new web3.eth.Contract(abi, null,{
        data: code,
    });

    // Set up prescription data to be sent.
    Patient.options.address = fs.readFileSync("./patient_contract_address.txt").toString('ascii');
    let transaction = await Patient.methods.updatePrescription(drugChainIndex, dispenserID,drugQuantity, 
                                                        fulfillmentDate, daysValid, isCancelled, cancelDate);
    
    // Submitting prescription transaction.
    let encoded_transaction = transaction.encodeABI();
    let block = await web3.eth.sendTransaction({
        data: encoded_transaction,
        from: account,
        to: Patient.options.address,
        gas: 50000000
    });
    
    // Return Transaction object containing transaction hash and other data
    return block;

}

