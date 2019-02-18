import React, { Component } from "react";
import axios from "axios";
import qs from 'qs';
import { Link } from "react-router-dom";

class PrescriptionEdit extends Component {

  constructor(props){
    super(props);
    //TODO: Access control pattern here to check for proper usertype.

    this.state = {cancelDate: ""}
    const querystring = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const prescriptionNo = querystring.ID;

    axios
      .get(`/api/v1/prescriptions/single/${prescriptionNo}`)
      .then(results => results.data)
      .then(prescription => this.setState({patientID: prescription.patientID,
                                          prescriptionID: prescription.prescriptionID,
                                          drugID: prescription.drugID,
                                          fillDates: prescription.fillDates,
                                          writtenDate: prescription.writtenDate,
                                          quantity: prescription.quantity,
                                          daysFor: prescription.daysFor,
                                          refillsLeft: prescription.refillsLeft,
                                          prescriberID: prescription.prescriberID,
                                          dispenserID: prescription.dispenserID,
                                          cancelled: prescription.cancelled,
                                          cancelDate: prescription.cancelDate
      }));
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

  // Updating value in the dispenserID state
  onKeyDownDispenserID = event => {
    this.setState({dispenserID: event.target.value});
  }

  // Sending the prescription to be changed
  onEditPrescription = () => {

    var prescriptionEditQuery= `/api/v1/prescriptions/edit`;
    axios
        .post(prescriptionEditQuery,{
        "prescriptionID": this.state.prescriptionID,
        "quantity": this.state.quantity,
        "daysFor": this.state.daysFor,
        "refillsLeft": this.state.refillsLeft,
        "dispenserID": this.state.dispenserID
      });
    /* Send a message back for an error or a success */

  }

  render() {
    return (
    /* Logic to render text conditionally */
      <div className="App">
      { this.state.cancelDate === "" ? "Loading..." :
        this.state.cancelDate === -1 && this.state.fillDates.length === 0 ?
        <div className="col-xl-8 order-xl-1 center">
        <div className="card bg-secondary shadow">
          <div className="card-header bg-white border-0">
              <div className="row align-items-center">
                <div className="col-8 text-left">
                  <h3 className="mb-0">Prescription Edit</h3>
                </div>
              </div>
          </div>
          <div className="card-body text-left">
          <form>
            <div className="pl-lg-4">
            <div className="row">
              <div className="col-lg">
                <div className="form-group focused">
                  <label className="form-control-label">Prescription ID</label>
                  <input disabled
                  type="p"
                  className="form-control"
                  placeholder={`Prescription ID: ${this.state.prescriptionID}`}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Patient ID</label>
                  <input disabled
                  type="p"
                  className="form-control"
                  placeholder={`Patient ID: ${this.state.patientID}`}
                  onChange={this.onKeyDownPatientID}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Drug ID</label>
                  <input disabled
                  type="p"
                  placeholder={`Drug ID: ${this.state.drugID}`}
                  className="form-control"/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Prescriber ID</label>
                  <input disabled
                  type="p"
                  className="form-control"
                  placeholder={`Prescriber ID: ${this.state.prescriberID}`}/>
                </div>
              </div>
            </div>
            <hr class="my-4"></hr>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Quantity</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the quantity"
                  value = {this.state.quantity}
                  onChange={this.onKeyDownQuantity}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Days For</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of days for"
                  value = {this.state.daysFor}
                  onChange={this.onKeyDownDaysFor}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Refills Left</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter the number of refills left"
                  value = {this.state.refillsLeft}
                  onChange={this.onKeyDownRefillsLeft}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group focused">
                  <label className="form-control-label">Dispenser ID</label>
                  <input
                  type="p"
                  className="form-control"
                  placeholder="Enter a Dispenser ID"
                  value = {this.state.dispenserID}
                  onChange={this.onKeyDownDispenserID}/>
                </div>
              </div>
            </div>
            <Link to={"/patient?ID=" + this.state.patientID}>
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
              className ="btn btn-success my-4"
              onClick={this.onEditPrescription}>
              Confirm
            </button>
            </div>
          </form>
          </div>
        </div>
        </div>
        :
        <div className="col-8 center">
          <div className="alert alert-warning" role="alert">
            <span className="alert-inner--text"><strong>WARNING: </strong> Unable to edit. The prescription may have been fulfilled or cancelled.</span>
          </div>
        </div>
      }
      </div>
    );
  }
}

export default PrescriptionEdit;