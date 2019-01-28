import React, { Component } from "react";
import PropTypes from "prop-types";

class People extends Component {

  // Displays all the people in a table with clickable links to each patient.
  displayPeople = () => {
    return this.props.patientList.map(person => {
      return(
        <tr key={person.patient_id}>
          <td>
          <a href = {"/patient?ID=" + person.patient_id}>
          {person.patient_id}</a>
          </td>
          <td>
            <a href = {"/patient?ID=" + person.patient_id} target="_blank">
              {person.first}
            </a>
          </td>
          <td>
            <a href = {"/patient?ID=" + person.patient_id}>
              {person.last}
            </a>
          </td>
          <td>
            <a href = {"/patient?ID=" + person.patient_id}>
              {person.dob}
            </a>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table class="table table-hover">
      <tbody>
        <tr class="table-primary">
          <th scope="col">ID</th>
          <th scope="col" >First Name</th>
          <th scope="col" >Last Name</th>
          <th scope="col">Date Of Birth</th>
        </tr>

        {this.displayPeople()}

      </tbody>
      </table>
    );
  }
}

// Just the form of each person
People.propTypes = {
  patientList: PropTypes.arrayOf(
      PropTypes.shape({
        patient_id: PropTypes.number.isRequired,
        first: PropTypes.string,
        last: PropTypes.string,
        dob: PropTypes.string
      }).isRequired,
    )
}

export default People;
