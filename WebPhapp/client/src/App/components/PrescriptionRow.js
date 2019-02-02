import React, { Component } from "react";
import PropTypes from "prop-types";
import "../style/PrescriptionRowStyle.css";

class PrescriptionRow extends Component {
  render() {
    return (
      <div className="PrescriptionRow">
        {this.props.prescriptionID}
        &nbsp;
        {this.props.patientID}
        &nbsp;
        {this.props.drugID}
        &nbsp;
        {this.props.fillDates}
        &nbsp;
        {this.props.writtenDate}
        &nbsp;
        {this.props.quantity}
        &nbsp;
        {this.props.daysFor}
        &nbsp;
        {this.props.refillsLeft}
        &nbsp;
        {this.props.prescriberID}
        &nbsp;
        {this.props.dispenserID}
        &nbsp;
        {String(this.props.cancelled)}
        &nbsp;
        {this.props.cancelDate}
        &nbsp;
      </div>
    );
  }
}

PrescriptionRow.propTypes = {
  prescriptionID: PropTypes.string.validatePrescriptionID,
  patientID: PropTypes.string.isRequired,
  drugID: PropTypes.string.isRequired,
  fillDates: PropTypes.arrayOf(PropTypes.string).isRequired,
  writtenDate: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  daysFor: PropTypes.number.isRequired,
  refillsLeft: PropTypes.number.isRequired,
  prescriberID: PropTypes.string.isRequired,
  dispenserID: PropTypes.string.isRequired,
  cancelled: PropTypes.bool.isRequired,
  cancelDate: PropTypes.string.isRequired,


  // a custom validator for a prescriptionID
  // returns an Error object if the validation fails.
  validatePrescriptionID: function(props, prescriptionID, prescriptionRow) {
    if (!/matchme/.test(props[prescriptionID])) {
      return new Error(
        'Invalid prop or missing prop: ' + prescriptionID + '` supplied to' +
        ' `' + prescriptionRow + '`. Validation failed.'
      );
    }
  }
};

export default PrescriptionRow;