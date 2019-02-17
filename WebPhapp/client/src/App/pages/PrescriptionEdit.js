import React, { Component } from "react";
import axios from "axios";
import qs from 'qs';

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

/*
Fields:
- prescriptionID - Can't change
- Patient ID     - Can't change
- Drug ID        - Can't change
- Filled Dates   - If filled, cannot change
- Written Date   - Static
- quantity       - Changable?
- Days for       - Changeable?
- Refills left   - Changeable?
- Prescriber ID  - Can't change
- Dispensor ID   - Changable?
- Cancelled      - If cancelled, cannot uncancel it or recancel it.
- Cancel Date    -

*/
  render() {
    return (
    /* Logic to render text conditionally */
      <div className="App">
      { this.state.cancelDate === "" ? "Loading..." :
        this.state.cancelDate === -1 && this.state.fillDates.length === 0 ?
        <form>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input disabled
                type="p"
                className="form-control"
                placeholder={`Prescription ID: ${this.state.prescriptionID}`}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input disabled
                type="p"
                className="form-control"
                placeholder={`Patient ID: ${this.state.patientID}`}
                onChange={this.onKeyDownPatientID}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input disabled
                type="p"
                placeholder={`Drug ID: ${this.state.drugID}`}
                className="form-control"/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input
                type="p"
                className="form-control"
                placeholder="Quantity"
                value = {this.state.quantity}
                onChange={this.onKeyDownQuantity}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input
                type="p"
                className="form-control"
                placeholder="Days For"
                value = {this.state.daysFor}
                onChange={this.onKeyDownDaysFor}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input
                type="p"
                className="form-control"
                placeholder="Refills Left"
                value = {this.state.refillsLeft}
                onChange={this.onKeyDownRefillsLeft}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input disabled
                type="p"
                className="form-control"
                placeholder={`Prescriber ID: ${this.state.prescriberID}`}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 center">
              <div className="form-group">
                <input
                type="p"
                className="form-control"
                placeholder="Dispenser ID"
                value = {this.state.dispenserID}
                onChange={this.onKeyDownDispenserID}/>
              </div>
            </div>
          </div>
          <button
            type="button"
            className ="btn btn-primary my-4"
            onClick={this.onEditPrescription}>
            Edit Prescription
          </button>
        </form>

        :
        <b> Not able to alter because the prescription has been fulfilled or cancelled.  </b>
      }

      </div>
    );
  }
}

export default PrescriptionEdit;
