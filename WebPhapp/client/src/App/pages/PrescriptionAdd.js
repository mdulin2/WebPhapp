import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class PrescriptionAdd extends Component {
  // Initialize the state
  state = {
    patientID: 0,
    drugID:0,
    quantity: "",
    daysFor: 0,
    refillsLeft: 0,
    prescriberID: 0,
    dispenserID: 0,
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

  // Updating value in the days daysFor state
  onKeyDownDaysFor = event => {
    this.setState({daysFor: event.target.value});
  }

  // Updating value in the refillsLeft state
  onKeyDownRefillsLeft = event => {
    this.setState({refillsLeft: event.target.value});
  }

  // Updating value in the prescriberID state
  onKeyDownPrescriberID = event => {
    this.setState({prescriberID: event.target.value});
  }

  // Updating value in the dispenserID state
  onKeyDownDispenserID = event => {
    this.setState({dispenserID: event.target.value});
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
        "daysFor": this.state.daysFor,
        "refillsLeft": this.state.refillsLeft,
        "prescriberID": this.state.prescriberID,
        "dispenserID": this.state.dispenserID
      });

  }

  render() {
    // User role from log in
    const user = this.props.role; 
    return (
      <div>
      {user === 'Prescriber' || user === 'Admin' ?
      <div className="App">

        <div className="modal fade" id="add-prescription-modal" tabindex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
            <div className="modal-dialog modal-" role="document">
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <span className="alert-inner--icon"><i className="fas fa-check-circle"></i></span>
                    <span className="alert-inner--text"><strong> SUCCESS: </strong> Prescription successfully added to Pharmachain.</span>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="col-xl-8 order-xl-1 center">
        <div className="card bg-secondary shadow">
          <div className="card-header bg-white border-0">
              <div className="row align-items-center">
                <div className="col-8 text-left">
                  <h3 className="mb-0">Prescription Add</h3>
                </div>
              </div>
          </div>
          <div className="card-body text-left">
          <form>
            <div className="pl-lg-4"> </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Patient ID:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the patient's ID"
                  onChange={this.onKeyDownPatientID}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Drug ID:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the drug's ID"
                  onChange={this.onKeyDownDrugID}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Quantity:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the quantity"
                  onChange={this.onKeyDownQuantity}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Days For:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of days for"
                  onChange={this.onKeyDownDaysFor}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Refills Left:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of refills left"
                  onChange={this.onKeyDownRefillsLeft}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Prescriber ID:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the prescriber's ID"
                  onChange={this.onKeyDownPrescriberID}/>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group focused">
                <label className="form-control-label">Dispenser ID:</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the dispenser's ID"
                  onChange={this.onKeyDownDispenserID}/>
                </div>
              </div>
            </div>
          </form>
          <Link to={"/"}>
                <button
                  type="button"
                  className="btn btn-danger my-4"
                  variant="raised">
                  Cancel
                </button>
          </Link>
          <nbsp> </nbsp>
          <button
            type="button"
            class="btn btn-success my-4"
            data-toggle="modal"
            data-target="#add-prescription-modal"
            onClick={this.onSendPrecription}>
            Add Prescription
          </button>
          </div>
          </div>
        </div>
      </div>
      : 
      "Not authorized :(" }
    </div>
    );
  }
}

export default PrescriptionAdd;
