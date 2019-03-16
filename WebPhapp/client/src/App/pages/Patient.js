import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import qs from 'qs';

import Prescription from "../components/Prescription";


class Patient extends Component {
  // Initialize the state
  state = {
    prescriptions: []
  };

  // Fetch the prescription on first mount
  componentDidMount() {
    this.getPrescriptions();
  }

  // Retrieves the items in a prescription from the Express app
  // ex. api/v1/prescriptions/01
  getPrescriptions = () => {

    // Gets parameter from the URL of 'ID'
    const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const patientID = querystring.ID;

    axios
      // String interpolation.
      .get(`/api/v1/prescriptions/${patientID}`)
      .then(results => results.data)
      .then(prescriptions => this.setState({ prescriptions }));
  };

  // displayPrescriptions() displays the properties of a prescription using Prescription
  // @return: returns all prescriptions for a patient id
  displayPrescriptions = () => {
    return(
      <Prescription
        prescriptions = {this.state.prescriptions}
        getPrescriptions = {this.getPrescriptions}
        user = {this.props.user}
      />
    )
  }

  render() {
    const prescriptions = this.state.prescriptions;
    return (
      <div className="App">
        {/* Check to see if any prescriptions are found*/}
        {prescriptions ? (
          <div>
            {/* Render the prescription */}
            {this.displayPrescriptions()}
          </div>
        ) : (
          <div>
            <h2>No Prescriptions Found</h2>
          </div>
        )}
      </div>
    );
  }
}

export default Patient;
