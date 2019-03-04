let fs = require("fs");
let Web3 = require("web3");
let net = require("net");


/* Helper script to check if dummy data exists on the blockchain
 * If it exists do nothing, else upload json dummy data in ../backend/dummy_data/prescriptions.json
 * Usage: sudo node load_data.js
 */
async function loadPrescriptions(){

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

    let length = await Patient.methods.getDrugChainLength().call({from: account});
    
    if(length == 0){
	console.log("No prescriptions found, adding dummy data.");
	var obj = JSON.parse(fs.readFileSync('../backend/dummy_data/prescriptions.json', 'utf8'));
	for (var j = 0; j < obj.prescriptions.length; j++){
	    p = obj.prescriptions[j];
            
            //Temp variable to store fillDates
            let fillDates = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            for (var i = 0; i < p.fillDates.length; i++){
	        if(p.fillDates[i] > 0){
	            fillDates[i] = p.fillDates[i]
                }	
	    }

	    let transaction = await Patient.methods.addPrescription(
		p.patientID,
		p.prescriberID,
		p.dispenserID,
		p.drugID,
		p.quantity,
		fillDates, //p.fillDates,
		p.writtenDate,
		p.daysFor,
		p.refillsLeft,
		false, //fix once data format between block and front/backend is changed,
		p.cancelDate
	    );
	
	    let encoded_transaction = transaction.encodeABI();
	    let block = await web3.eth.sendTransaction({
		data: encoded_transaction,
		from: account,
		to: Patient.options.address,
		gas: 50000000
	    });
	}
    } else {
	console.log("Existing prescriptions found, dummy data not loaded.");
    }
    return
}

loadPrescriptions();
