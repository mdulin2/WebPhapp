pragma solidity ^0.4.24;


import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PrescriptionData.sol";
import "../contracts/PrescriptionBase.sol";
import "../contracts/Patient.sol";

//Truffle Test Docs for Errors: https://truffleframework.com/tutorials/testing-for-throws-in-solidity-tests

contract TestPrescriptionData is PrescriptionBase{
    
    Patient p = Patient(DeployedAddresses.Patient());

    uint64[16] fu = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // cannot assign arrays as a constant. So, this var must be here.
    Prescription data = Prescription({
        patientID: 0,
        prescriberID: 1,
        dispenserID: 2,
        drugID : 34,
        drugQuantity: "300mg",
        fulfillmentDates: fu,
        dateWritten: 1542357074,
        daysValid: 200,
        refillsLeft: 8,
        isCancelled: false,
        cancelDate: 0
    });

    // Test the ability to add a prescription
    function testAddingPrescription() public {
        uint index = p.addPrescription(data.patientID, data.prescriberID, data.dispenserID, data.drugID,
        data.drugQuantity, data.fulfillmentDates, data.dateWritten, data.daysValid, data.refillsLeft,
        data.isCancelled, data.cancelDate);
        Assert.equal(0, index, "index return error");

        uint256 patientID;
        uint128 prescriberID;
        uint128 dispenserID;
        uint64 drugID;
        string memory drugQuantity;
        uint64[16] memory fulfillmentDates;
        uint64 dateWritten;

        //Max local args is 16, limit reached. So last 4 values are not compared
        (patientID, prescriberID, dispenserID, drugID, drugQuantity, fulfillmentDates, dateWritten, , , , ) = p.getPatientPrescription(index);

        Assert.equal(uint(patientID), uint(data.patientID), "PatientID error....");
        Assert.equal(uint(prescriberID), uint(data.prescriberID), "PrescriberID error....");
        Assert.equal(string(drugQuantity), string(data.drugQuantity), "Drug quantity error....");
    }

	//Test ability to update a prescription
    function testUpdate() public{
        uint index = p.addPrescription(
            data.patientID,
            data.prescriberID,
            data.dispenserID,
            data.drugID,
            data.drugQuantity,
            data.fulfillmentDates,
            data.dateWritten,
            data.daysValid,
            data.refillsLeft,
            data.isCancelled,
            data.cancelDate
        );

        p.updatePrescription(
            index,
            3,
            data.drugQuantity,
            data.daysValid,
            data.refillsLeft
        );

        uint256 patientID;
        uint128 prescriberID;
        uint128 dispenserID;

         //Max local args is 16, limit reached. So last values are not compared
        (patientID, prescriberID, dispenserID, , , , , , , , ) = p.getPrescription(index);
        Assert.equal(uint (dispenserID), uint (data.dispenserID + 1), "dispenserID not updated error....");
    }

    //Tests adding then cancelling a prescription
    function testCancel() public{
        uint index = p.addPrescription(data.patientID, data.prescriberID, data.dispenserID, data.drugID,
        data.drugQuantity, data.fulfillmentDates, data.dateWritten, data.daysValid, data.refillsLeft,
        data.isCancelled, data.cancelDate);
        uint256 canceled = p.cancelPrescription(index, 10);
        Assert.equal(uint256(canceled),uint64(0), "Prescription not cancelled...");
    }
    
    //Tests redeeming a prescription
    function testRedeem() public{
        uint index = p.addPrescription(data.patientID, data.prescriberID, data.dispenserID, data.drugID,
            data.drugQuantity, data.fulfillmentDates, data.dateWritten, data.daysValid, data.refillsLeft,
            data.isCancelled, data.cancelDate);
        uint redeem = p.redeemPrescription(index, 10);
 
        uint256 patientID;
        uint128 prescriberID;
        uint128 dispenserID;
        uint128 refillsLeft;

         //Max local args is 16, limit reached. So last values are not compared
        (patientID, prescriberID, dispenserID, , , , , , refillsLeft, , ) = p.getPrescription(index);
        Assert.equal(uint(0), uint(redeem), "Unsucessful redemption");
        Assert.equal(uint(refillsLeft), uint(data.refillsLeft - 1), "Refills not decremented");
    }

    // Tests the results of an improper access for a prescription. 
    function testImproperChainIndexCheck() public {
        bool result = DeployedAddresses.Patient().call(bytes4(bytes32(keccak256("getPatientPrescription(2)"))));
        Assert.isFalse(result, "Failed to get prescription 2.");
        result = DeployedAddresses.Patient().call(bytes4(bytes32(keccak256("getPatientPrescription(0)"))));
        Assert.isFalse(result, "Failed to get prescription 0.");
    }
}

