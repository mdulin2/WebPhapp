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
        {String(this.props.filled)}
        &nbsp;
        {this.props.fillDates}
        &nbsp;
        {this.props.writtenDate}
        &nbsp;
        {this.props.oldestFillDate}
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
  prescriptionID: PropTypes.string,
  patientID: PropTypes.string,
  drugID: PropTypes.string,
  filled: PropTypes.bool,
  fillDates: PropTypes.arrayOf(PropTypes.string),
  writtenDate: PropTypes.string,
  oldestFillDate: PropTypes.string,
  quantity: PropTypes.number,
  daysFor: PropTypes.number,
  refillsLeft: PropTypes.number,
  prescriberID: PropTypes.string,
  dispenserID: PropTypes.string,
  cancelled: PropTypes.bool,
  cancelDate: PropTypes.string
};

export default PrescriptionRow;
