import React, { Component } from "react";
import axios from "axios";


class PrescriptionAdd extends Component {
  // Initialize the state
  state = {
    patientID: 0,
    drugID:0,
    quantity: "",
    daysValid: 0,
    refills: 0,
    prescriberID: 0,
    dispensorID: 0,
    message: ''
  };

  // Updating value in the patientID state
  onKeyDownPatientID = event => {
    this.setState({patientID: event.target.value});
  }

  /* Seperate component for this to validate it... */
  // Updating value in the drugID state
  onKeyDownDrugID = event => {
    this.setState({drugID: event.target.value});
  }

  // Updating value in the quantity state
  onKeyDownQuantity = event => {
    this.setState({quantity: event.target.value});
  }

  // Updating value in the days daysValid state
  onKeyDownDaysValid = event => {
    this.setState({daysValid: event.target.value});
  }

  // Updating value in the refills state
  onKeyDownRefills = event => {
    this.setState({refills: event.target.value});
  }

  // Updating value in the dispensorID state
  onKeyDownDispensorID = event => {
    this.setState({dispensorID: event.target.value});
  }

  // Sending the prescription to be added
  onSendPrecription = () => {

    var prescriptionAddQuery= `/api/v1/prescriptions/add`;

    /* Send a message back for an error or a success */
    axios
      .post(prescriptionAddQuery,{
        "patientID": this.state.patientID,
        "drugID": this.state.drugID,
        "quantity": this.state.quantity,
        "daysValid": this.state.daysValid,
        "refills": this.state.refills,
        "prescriberID": this.state.prescriberID,
        "dispensorID": this.state.dispensorID
      });

  }

  render() {

    return (
      <div className="form-group">
        <h1>Add Prescription </h1>
        <form>

          <label>
            Patient ID
          </label>
          <input
            type="p"
            value={this.state.patientID}
            onChange={this.onKeyDownPatientID}
          />

          <label>
            &nbsp; Drug&nbsp;
          </label>
          <input
            type="p"
            value={this.state.drugID}
            onChange={this.onKeyDownDrugID}
          />
          <label>
            &nbsp; Quantity&nbsp;
          </label>
          <input
            type="p"
            value={this.state.quantity}
            onChange={this.onKeyDownQuantity}
          />
          <label>
            &nbsp; Days Valid&nbsp;
          </label>
          <input
            type="p"
            value={this.state.daysValid}
            onChange={this.onKeyDownDaysValid}
          />
          <label>
            &nbsp; Dispensor ID&nbsp;
          </label>
          <input
            type="p"
            value={this.state.dispensorID}
            onChange={this.onKeyDownDispensorID}
          />
        </form>

          <button type="button" class="btn btn-info" onClick={this.onSendPrecription}>
            Add Prescription
          </button>
      </div>
    );
  }
}

export default PrescriptionAdd;
