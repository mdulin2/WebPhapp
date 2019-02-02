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

    // Updating text in the patient id state
    onKeyDownPatientID = event => {
      this.setState({patientID: event.target.value});
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

    axios
      // .get(idSearchQuery)
      .get(nameSearchQuery)
      .then(results => results.data)
      .then(people => this.setState({ people }));
  }

  render() {

    return (
        // Returns a navigation bar styled according to the Argon style system
        <div className="form-group">
          <nav className="navbar navbar-horizontal navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <a className="navbar-brand" href="#">Patient Lookup</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar-default">
                    <div className="navbar-collapse-header">
                      <div className="row">
                          <div className="col-6 collapse-brand">
                              <a href="../../index.html">
                                  <img src="../../../public/assets/img/brand/blue.png"/>
                              </a>
                          </div>
                          <div className="col-6 collapse-close">
                              <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                                  <span></span>
                                  <span></span>
                              </button>
                          </div>
                      </div>
                    </div>
                    <ul className="navbar-nav ml-lg-auto">
                        <li className="nav-item">
                            <a className="nav-link nav-link-icon" href="#">
                                <i className="ni ni-favourite-28"></i>
                                <span className="nav-link-inner--text d-lg-none">Discover</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link nav-link-icon" href="#">
                                <i className="ni ni-notification-70"></i>
                                <span className="nav-link-inner--text d-lg-none">Profile</span>
                            </a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link nav-link-icon" href="#" id="navbar-default_dropdown_1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="ni ni-settings-gear-65"></i>
                                <span className="nav-link-inner--text d-lg-none">Settings</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-default_dropdown_1">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <br/>

        {/* Returns a text fields to search patients styled according to the Argon style system */}
        <form role="form">
      
          <div class="form-group mb-3">
            <div class="input-group input-group-alternative">
              <div class="input-group-prepend">
                <span class="input-group-text"></span>
              </div>
              <input 
                class="form-control" 
                placeholder="Patient ID" 
                type="p"
                value={this.state.patientID}
                onChange={this.onKeyDownPatientID}
              />
            </div>
          </div>

          <div class="form-group">
            <div class="input-group input-group-alternative">
              <div class="input-group-prepend">
                <span class="input-group-text"></span>
              </div>
              <input 
                class="form-control" 
                placeholder="First Name" 
                type="p"
                value={this.state.firstName}
                onChange={this.onKeyDownFirstName}
              />
            </div>
          </div>

          <div class="form-group">
            <div class="input-group input-group-alternative">
              <div class="input-group-prepend">
                <span class="input-group-text"></span>
              </div>
              <input 
                class="form-control" 
                placeholder="Last Name" 
                type="p"
                value={this.state.lastName}
                onChange={this.onKeyDownLastName}
              />
            </div>
          </div>

          <div class="text-center">
            <button type="button" className="btn btn-primary my-4"
              onClick={this.onSearchPatients}>
              Search
            </button>
          </div>
        </form>

        <People patientList={this.state.people}/>
      </div>
    );
  }
}

export default PatientSearch;