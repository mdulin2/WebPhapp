import React, { Component } from "react";
import axios from "axios";
import PrescriptionRow from "../components/PrescriptionRow";
import qs from 'qs';

class Patient extends Component {
  // Initialize the state
  state = {
    prescription: []
  };

  // Fetch the prescription on first mount
  componentDidMount() {
    this.getPrescription();
  }

  // Retrieves the items in a prescription from the Express app
  // ex. api/v1/prescriptions/01
  getPrescription = () => {

    // Gets parameter from the URL of 'ID'
    const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const patientID = querystring.ID;

    axios
      // String interpolation.
      .get(`/api/v1/prescriptions/${patientID}`)
      .then(results => results.data)
      .then(prescription => this.setState({ prescription }));
  };

  // displayPrescription() displays the properties of a prescription using PrescriptionRow
  // @return: returns all prescriptions for a patient id
  displayPrescriptions = () =>
    this.state.prescription.map(prescription => (
      <PrescriptionRow
        // unique identifier or key is the prescription ID
        key={prescription.prescriptionID}
        prescriptionID={prescription.prescriptionID}
        patientID={prescription.patientID}
        drugID={prescription.drugID}
        filled={prescription.filled}
        fillDates={prescription.fillDates}
        writtenDate={prescription.writtenDate}
        oldestFillDate={prescription.oldestFillDate}
        quantity={prescription.quantity}
        daysFor={prescription.daysFor}
        refillsLeft={prescription.refillsLeft}
        prescriberID={prescription.prescriberID}
        dispenserID={prescription.dispenserID}
        cancelled={prescription.cancelled}
        cancelDate={prescription.cancelDate}
      />
    ));

  render() {
    const prescription = this.state.prescription;

    return (
      <div className="App">
        <h1>Prescription</h1>
        {/* Check to see if any prescriptions are found*/}
        {prescription ? (
          <div>
            {/* Render the prescription */}
            {this.displayPrescriptions()}
          </div>
        ) : (
          <div>
            <h2>No Prescription Found</h2>
          </div>
        )}
      </div>
    );
  }
}

export default Patient;
