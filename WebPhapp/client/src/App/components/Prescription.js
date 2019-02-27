import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../style/Alerts.css"

class Prescription extends Component {
    constructor(props){
        super(props);
        // Check for type of user with some API call.
        const user = 'prescriber';
        this.state={
            user: user,
        }
    }

    // Gets the events id, to cancel the proper prescription.
    onCancelClick = event => {
        // Probably add some validation to make sure the user wants to delete this.
        const cancelQuery = `/api/v1/prescriptions/cancel/${event.target.id}`
        axios
        .get(cancelQuery)
        .then(results => results.data);
        //Grey out cancelled prescription.
        this.props.getPrescriptions();
    }

    // Displays all prescription cards for a patient
    displayPrescriptions = () => {
        var prescriptionCount = -1;
        return this.props.prescriptions.map(prescription => {
            var writtenDate = prescription.writtenDate.split(" ", 4).join(" ");
            prescriptionCount += 1;
            return(
                <div className="card card-stats mb-4 ml-4"  key={prescription.prescriptionID} style={{width: '21rem'}} >
                    <div className="card-body" >
                        <div className="row">
                            <div className="col">
                                <h5 className="card-title text-uppercase text-muted text-left mb-0">Prescription {prescription.prescriptionID} &nbsp;
                                    <span className="h2 font-weight-bold mb-0">{prescription.drugName}</span>
                                </h5>
                                <p className="mt-3 mb-0 text-muted text-sm text-left">
                                    <span className="text-nowrap">
                                        Quantity: {prescription.quantity}
                                        <br></br>
                                        Days For: {prescription.daysFor}
                                        <br></br>
                                        Refills Left: {prescription.refillsLeft}
                                        <br></br>
                                        Date Written: {writtenDate}
                                    </span>
                                </p>
                            </div>
                            <div className="col">
                                <div className="icon icon-shape bg-default text-white rounded-circle shadow lg">
                                    <i className="fas fa-file-prescription"></i>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <button className="btn btn-icon btn-3 btn-outline-primary btn-block" type="button" data-toggle="modal" data-target="#prescription-modal" id={prescriptionCount} onClick={this.onClickViewPrescription}>
                            <span className="btn-inner--icon"><i className="ni ni-bullet-list-67"></i></span>
                            <span className="btn-inner--text">More Info</span>
                        </button>
                    </div>
                </div>
            )
        })
    }

    // Displays the prescription card modal for "more info" of a prescription
    onClickViewPrescription = (event) => {
        var prescriptionID = event.target.id || event.currentTarget.id;        
        const modalPrescription = this.props.prescriptions[prescriptionID];
        this.setState({modalPrescription});
    }

    // Displays the table body for the fill dates of a prescription
    displayFillDates(fillDates){
        if (fillDates == 0) {
            return (
                <tr>
                    <td>{"-"}</td>
                    <td>{"N/A"}</td>
                </tr>
            )
        } else {
            return fillDates.map((date, index) => 
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{date}</td>
            </tr>
            );
        }
    }

    render() {
        var prescription = this.state.modalPrescription;        
        var drugName = (prescription && prescription.drugName) || "";
        var quantity = (prescription && prescription.quantity) || "";
        var daysFor = (prescription && prescription.daysFor) || "";
        var refillsLeft = (prescription && prescription.refillsLeft);
        var writtenDate = prescription && (prescription.writtenDate.split(" ", 4).join(" "));
        var cancelDate = prescription && (prescription.cancelDate <= 0 ? "N/A" : prescription.cancelDate.split(" ", 4).join(" "));
        var fillDates = prescription && prescription.fillDates;  

        var fillDatesLength = prescription && prescription.fillDates.length;
        var formattedDates = [];
        for (var i = 0; i < fillDatesLength; i++){
            formattedDates.push(fillDates[i].split(" ", 4).join(" ")); 
        }

        return(
            <div className="container">
                <div className="masonry align-items-left">
                      {this.displayPrescriptions()}
                      {<div className="col-md-4">
                        <div className="modal fade" tabIndex="-1" id="prescription-modal">
                        <div className="modal-dialog modal-lg modal-dialog-centered modal" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title" id="modal-title-default">Prescription: {drugName}</h3>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"><i className="ni ni-fat-remove"></i></span>
                                </button>
                            </div>
                            <div className="modal-body">
                            <div className="row">
                                <div className="col-auto">
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Quantity:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{quantity}</span>
                                                </div>
                                                <div className="col-auto">
                                                <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                    <i className="fas fa-pills"></i>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Number of Days For:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{daysFor}</span>
                                                </div>
                                                <div className="col-auto">
                                                <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                    <i className="ni ni-calendar-grid-58"></i>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Refills Left:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{refillsLeft}</span>
                                                </div>
                                                <div className="col-auto">
                                                <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                    <i className="fas fa-prescription-bottle"></i>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Written Date:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{writtenDate}</span>
                                                </div>
                                                <div className="col-auto">
                                                <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                    <i className="fas fa-user-edit"></i>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="card card-stats mb-4 mb-lg-0 shadow" style={{ width: '18rem' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <h5 className="card-title text-uppercase text-muted mb-0 text-left">Date Cancelled:</h5>
                                                    <span className="h3 font-weight-bold mb-0">{cancelDate}</span>
                                                </div>
                                                <div className="col-auto">
                                                    <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                                        <i className="fas fa-ban"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card shadow">
                                        <div className="card-header border-0">
                                        <h4 className="mb-0 text-left">Past Refill Dates</h4>
                                        </div>
                                        <div className="table-responsive">
                                        <table className="table align-items-center table-flush">
                                            <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Refill Number</th>
                                                <th scope="col">Date</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {this.displayFillDates(formattedDates)}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                    <br></br>
                                    
                                    <div className="row justify-content-center form-inline">
                                        <div className="form-group justify-content-bottom">
                                        { prescription && prescription.fillDates.length === 0 && prescription.cancelDate === 0 ?
                                            <div>
                                            <button type = "button"
                                                className = "btn btn-outline-danger"
                                                style={{width: '8rem'}}
                                                id = {prescription.prescriptionID}
                                                data-target="cancel-alert"
                                                data-toggle="modal" 
                                                data-target="#cancel-prescription-modal"
                                                onClick = {this.onCancelClick}>
                                                <span className="btn-inner--text">Cancel </span>
                                                <span><i className="fas fa-trash-alt"></i></span>
                                            </button>
                                            <button type = "button"
                                                className = "btn btn-outline-success"
                                                style={{width: '8rem'}}
                                                id = {prescription.prescriptionID}
                                                onClick = {(e) => window.location.href=`/prescriptionEdit?ID=${e.currentTarget.id}`}>
                                                <span className="btn-inner--text">Edit </span>
                                                <span><i className="fas fa-edit"></i></span>
                                            </button>
                                            </div>
                                            : ""
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="modal-footer justify-content-center ">
                                <div className="row text-xs text-uppercase text-muted mb-0">
                                    <div className="col-auto"><i className="fas fa-file-prescription">&nbsp;</i> Prescription ID: {(prescription && prescription.prescriptionID) || ""} </div>
                                    <div className="col-auto"><i className="fas fa-capsules">&nbsp;</i> Drug ID: {(prescription && prescription.drugID) || ""}</div>
                                    <div className="col-auto"><i className="fas fa-user">&nbsp;</i> Patient ID: {(prescription && prescription.patientID) || ""}</div>
                                    <div className="col-auto"><i className="fas fa-user-md">&nbsp;</i> Prescriber ID: {(prescription && prescription.prescriberID) || ""}</div>
                                    <div className="col-auto"><i className="fas fa-hospital">&nbsp;</i> Dispenser ID: {(prescription && prescription.dispenserID) || ""}</div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        </div>
                    }
                    {
                    <div className="modal fade-up" id="cancel-prescription-modal" tabindex="-1" role="dialog" aria-labelledby="modal-default" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-bottom modal-" role="document">
                            <div className="alert alert-danger alert-dismissible" role="alert">
                                <span className="alert-inner--text"><strong> CANCELLED: </strong> Prescription cancelled from Pharmachain.</span>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    }                    
                </div>
            </div>
        );
    }
}

Prescription.propTypes = {
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

export default Prescription;
