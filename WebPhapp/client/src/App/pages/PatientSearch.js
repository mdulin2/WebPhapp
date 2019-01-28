import React, { Component } from "react";
import axios from "axios";
import People from '../components/People'


class PatientSearch extends Component {
  // Initialize the state
  state = {
    people: [],
    firstName: "",
    lastName:""
  };

  componentDidMount() {
    // Loads all patients by default
    axios
      .get("/api/v1/patients?first=&last=")
      .then(results => results.data)
      .then(people => this.setState({ people }));
  }

  // Updating text in the first name state
  onKeyDownFirstName = event => {
    this.setState({firstName: event.target.value});
  }

  // Updating text in the first last state
  onKeyDownLastName = event => {
    this.setState({lastName: event.target.value});
  }

  // Search query for patient lookup via names
  onSearchPatients = () => {
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;

    // string interpolation
    var searchQuery= `/api/v1/patients?first=${firstName}&last=${lastName}`;

    axios
      .get(searchQuery)
      .then(results => results.data)
      .then(people => this.setState({ people }));
  }

  render() {

    return (
      <div className="form-group">
        <h1>Patient Search </h1>
        <form>

          <label>
            First Name: &nbsp;
          </label>
          <input
            type="p"
            value={this.state.firstName}
            onChange={this.onKeyDownFirstName}
          />

          <label>
            &nbsp; Last Name: &nbsp;
          </label>
          <input
            type="p"
            value={this.state.lastName}
            onChange={this.onKeyDownLastName}
          />
        </form>

          <button type="button" class="btn btn-info" onClick={this.onSearchPatients}>
            Search
          </button>

        <People patientList={this.state.people}/>
      </div>
    );
  }
}

export default PatientSearch;
