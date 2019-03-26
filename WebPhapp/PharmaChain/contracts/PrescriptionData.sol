pragma solidity ^0.4.24;

import "./PrescriptionBase.sol";


contract PrescriptionData is PrescriptionBase {

    Prescription[] public drugChain;

    function getPrescription(uint chainIndex)
        public view returns (
            uint256,
            uint128,
            uint128,
            uint64,
            string memory,
            uint64[16] memory,
            uint64,
            uint16,
            uint8,
            bool,
            uint64) {
        
        Prescription memory p = drugChain[chainIndex];
        return (
            p.patientID,
            p.prescriberID,
            p.dispenserID,
            p.drugID,
            p.drugQuantity,
            p.fulfillmentDates,
            p.dateWritten,
            p.daysValid,
            p.refillsLeft,
            p.isCancelled,
            p.cancelDate
        );
    }

    function getDrugChainLength() public view returns (uint) {
        return drugChain.length;
    }
    
    function isValidIndex(uint chainIndex) public view returns (uint) {
        if(0 <= chainIndex && chainIndex < getDrugChainLength()) {
            return 0;
        }
        //invalid chain index
        return 1;
    }

    function updatePrescription(
        uint chainIndex,
        uint128 dispenserID,
        string memory drugQuantity,
        uint16 daysValid,
        uint8 refillsLeft) public returns(uint) {
    	
        Prescription storage p = drugChain[chainIndex];
        if(p.isCancelled == true){
            //Prescription cancelled, cannot edit, error
            return 1;
        }
        p.dispenserID = dispenserID;
        p.drugQuantity = drugQuantity;
        p.daysValid = daysValid;
        p.refillsLeft = refillsLeft;

        return 0;
    }

    function addPrescription(
        uint256 patientID,
        uint128 prescriberID,
        uint128 dispenserID,
        uint64 drugID,
        string memory drugQuantity,
        uint64[16] memory fulfillmentDates,
        uint64 dateWritten,
        uint16 daysValid,
        uint8 refillsLeft,
        bool isCancelled,
        uint64 cancelDate) public returns (uint) {
            
        Prescription memory p = Prescription(
            patientID,
            prescriberID,
            dispenserID,
            drugID,
            drugQuantity,
            fulfillmentDates,
            dateWritten,
            daysValid,
            refillsLeft,
            bool(isCancelled),
            cancelDate
        );

        drugChain.push(p);
        return drugChain.length - 1;
    }

    function cancelPrescription(uint chainIndex, uint64 date) public returns (uint) {
    	// Prescription storage p = drugChain[chainIndex];
        if(drugChain[chainIndex].isCancelled) {
		    // Prescription already cancelled, error
            return 1;
        }
        
        drugChain[chainIndex].cancelDate = date;
        drugChain[chainIndex].isCancelled = true;
        return 0;
    }

    function redeemPrescription(uint chainIndex, uint64 date) public returns (uint) {
        Prescription storage p = drugChain[chainIndex];
        if(p.isCancelled) {
            //cannot refill cancelled prescription
            return 1;
        }
        if (p.refillsLeft < 1) {
            //cannot refill empty prescription
            return 2;
        }
        p.refillsLeft = p.refillsLeft - 1;
        for(uint64 i = 0; i < 16; i++) {
            if(p.fulfillmentDates[i] == 0) {
                p.fulfillmentDates[i] = date;
                break;
                //NOTE we need to discuss what happens if initial refillsLeft > 16
            }
        }
        return 0;
    }     
}
