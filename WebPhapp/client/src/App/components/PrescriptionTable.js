import React, { Component } from "react";
import PropTypes from "prop-types";
  
class PrescriptionTable extends Component {
    // Displays all prescriptions for a patient
    displayPrescriptions = () => {
        return this.props.prescriptions.map(prescription => {
            var fillDates = Array.isArray(prescription.fillDates) && prescription.fillDates.length === 0 ? "Not Yet Filled" : prescription.fillDates.toString();
            var cancel = prescription.cancelled ? "Yes" : "No";
            var cancelDate = prescription.cancelDate === "" ? "TBD" : prescription.cancelDate; 

            return(
                <tr key={prescription.prescriptionID}>
                    <td> {prescription.prescriptionID} </td>
                    <td> {prescription.patientID} </td>
                    <td> {prescription.drugID} </td>
                    <td>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            data-container="body"
                            data-toggle="popover"
                            data-trigger="hover"
                            title="Fill Dates"
                            data-placement="top"
                            data-content={fillDates}>
                            <span className="btn-inner--icon"><i className="ni ni-calendar-grid-58"></i></span>
                        </button>
                    </td>
                    <td> {prescription.writtenDate} </td>
                    <td> {prescription.quantity} </td>
                    <td> {prescription.daysFor} </td>
                    <td> {prescription.refillsLeft} </td>
                    <td> {prescription.prescriberID} </td>
                    <td> {prescription.dispenserID} </td>
                    <td> {cancel} </td>
                    <td> {cancelDate} </td>
                </tr>
            )
        })
    }

    render() {
        return(
            <table className="table table-hover">
            <tbody>
              <tr className="table-primary">
                <th scope="col">Prescription ID</th>
                <th scope="col" >Patient ID</th>
                <th scope="col" >Drug ID</th>
                <th scope="col" >Filled Dates</th>
                <th scope="col">Written Date</th>
                <th scope="col" >Quantity</th>
                <th scope="col" >Days For</th>
                <th scope="col" >Refills Left</th>
                <th scope="col" >Prescriber ID</th>
                <th scope="col" >Dispenser ID</th>
                <th scope="col" >Cancelled</th>
                <th scope="col" >Cancel Date</th>
              </tr>
      
              {this.displayPrescriptions()}
      
            </tbody>
            </table>  
        );
    }
}

PrescriptionTable.propTypes = {
    prescriptions: PropTypes.arrayOf(
        PropTypes.shape({
            prescriptionID: PropTypes.number.isRequired,
            patientID: PropTypes.number.isRequired,
            drugID: PropTypes.number.isRequired,
            fillDates: PropTypes.arrayOf(PropTypes.string).isRequired,
            writtenDate: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            daysFor: PropTypes.number.isRequired,
            refillsLeft: PropTypes.number.isRequired,
            prescriberID: PropTypes.number.isRequired,
            dispenserID: PropTypes.number.isRequired,
            cancelled: PropTypes.bool.isRequired,
            cancelDate: PropTypes.string.isRequired,
        }).isRequired,
    ),
  };

export default PrescriptionTable;