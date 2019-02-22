import React, { Component } from "react";
import axios from "axios";
import People from '../components/People'


class PatientSearch extends Component {
  // Initialize the state
  state = {
    people: [],
    patientID: "",
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

  // Updating text in the patient id state
  onKeyDownPatientID = event => {
      this.setState({patientID: String(event.target.value)});
    }

  // Updating text in the first name state
  onKeyDownFirstName = event => {
    this.setState({firstName: event.target.value});
  }

  // Updating text in the last name state
  onKeyDownLastName = event => {
    this.setState({lastName: event.target.value});
  }

  // Search query for patient lookup via names
  onSearchPatients = () => {
    const patientID = this.state.patientID;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;

    // String interpolation
    var idSearchQuery = `/api/v1/patients/${patientID}`;
    var nameSearchQuery= `/api/v1/patients?first=${firstName}&last=${lastName}`;

    if (patientID) {
      axios
      .get(idSearchQuery)
      .then(results => results.data)
      .then(people => this.setState({ people: [people] }));
    }

    else if (firstName || lastName) {
      axios
      .get(nameSearchQuery)
      .then(results => results.data)
      .then(people => this.setState({ people }));
    }
  }

  render() {

    return (
      <div className="col-xl-8 order-xl-1 center">
        <div className="card bg-secondary shadow">
          <div className="card-header bg-white border-0">
            <div className="row align-items-center">
              <div className="col-8 text-left">
                <h3 className="mb-0">Patient Search</h3>
              </div>
            </div>
          </div>
          <div className="card-body text-left">
          <div className="form-group">
          <form role="form">
            <div className="form-group mb-3">
              <div className="input-group input-group-alternative">
                <div className="input-group-prepend">
                  <span className="input-group-text"></span>
                </div>
                <input
                  className="form-control"
                  placeholder="Patient ID"
                  type="text"
                  value={this.state.patientID}
                  onChange={this.onKeyDownPatientID}
                />
              </div>
            </div>
            <hr class="my-4"></hr>
            <div className="form-group">
              <div className="input-group input-group-alternative">
                <div className="input-group-prepend">
                  <span className="input-group-text"></span>
                </div>
                <input
                  className="form-control"
                  placeholder="First Name"
                  type="p"
                  value={this.state.firstName}
                  onChange={this.onKeyDownFirstName}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group input-group-alternative">
                <div className="input-group-prepend">
                  <span className="input-group-text"></span>
                </div>
                <input
                  className="form-control"
                  placeholder="Last Name"
                  type="p"
                  value={this.state.lastName}
                  onChange={this.onKeyDownLastName}
                />
              </div>
            </div>

            <div className="text-center">
              <button type="button" className="btn btn-icon btn-3 btn-primary"
                onClick={this.onSearchPatients}>
                <span class="btn-inner--icon"><i class="fas fa-search"></i></span>
                <span class="btn-inner--text">Search</span>
              </button>
            </div>

          </form>
          <br></br>
          <People patientList={this.state.people}/>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientSearch;
