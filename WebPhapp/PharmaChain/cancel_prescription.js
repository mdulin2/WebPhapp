let fs = require("fs");
let Web3 = require("web3");
let net = require("net");

/*  This function cancels an existing prescription on the blockchain
    User input: prescription arguments
    Args:
        chainIndex (int)
        date (int)
    Example: 
        sudo node cancel_prescription.js 0 10
*/
async function cancel( chainIndex, date){

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
    let transaction = await Patient.methods.cancelPrescription(chainIndex, date);
    
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

// Main: 
let args = process.argv
let chainIndex= args[2];
let date = args[3];

cancel(chainIndex, date);
