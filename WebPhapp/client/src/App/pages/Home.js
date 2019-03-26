import React, { Component } from "react";

class Home extends Component {
  render() {
    // User role and id from log in
    const user = this.props.role; 
    const id = this.props.id;

    return (
      <div className="App">
          {/* Home page title */}
          <div className="header bg-gradient-primary py-7 py-lg-8">
          <div className="container">
            <div className="header-body text-left mb-7">
            <div className="container py-lg-md d-flex">
                <div className="col px-0">
                    <div className="row">
                    <div className="col-lg-6">
                        <h1 className="display-3 text-white">Welcome {user}!</h1> 
                        { user === 'Patient' ? 
                          <p className="lead text-white">As a patient, you have the ability to view your prescriptions.<br/>Select an option below...</p> 
                          :
                          user === 'Prescriber' ?
                          <p className="lead text-white">As a prescriber, you have the ability to search by patient or add, edit, or cancel a prescription.<br/>Select an option below...</p> 
                          :
                          user === 'Dispenser' ? 
                          <p className="lead text-white">As a dispenser, you have the ability to search by patient or dispenser or edit, cancel, or redeem a prescription.<br/>Select an option below...</p> 
                          :
                          user === 'Government' ?
                          <p className="lead  text-white">As a government overseer, you have the read-only ability to search by patient, dispenser, or prescriber.<br/>Select an option below...</p>
                          :
                          "" }
                    </div>
                    </div>
                </div>
                </div>
            </div>
          </div>
          </div>

          {/* Page content */}
          <section className="section section-lg pt-lg-0 mt--200">
          <div className="container">
              <div className="row justify-content-center">
              <div className="col-lg-12">
                  { user === 'Patient' ? 
                    <div className="row row-grid">
                      <div className="col-lg-4">
                      <div className="card card-lift--hover shadow border-0">
                      <div className="card-body py-5">
                          <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                          <i class="fas fa-prescription-bottle"></i>
                          </div>
                          <h6 className="text-primary text-uppercase">View Prescriptions</h6>
                          <p className="description mt-3">View all of your personal prescriptions. Each prescription has a drugname, quantity, date written, and more.</p>
                          <a href={`./patient?ID=${id}`} className="btn btn-primary mt-4">View My Prescriptions</a>
                      </div>
                      </div>
                      </div>
                    </div>
                    :
                    user === 'Prescriber' ?
                    <div className="row row-grid">
                      <div className="col-lg-4">
                      <div className="card card-lift--hover shadow border-0">
                      <div className="card-body py-5">
                          <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                          <i className="fas fa-user"></i> 
                          </div>
                          <h6 className="text-primary text-uppercase">Patient Search</h6>
                          <p className="description mt-3">Search a patient by ID, first name, or last name and view his or her personal prescriptions.</p>
                          <a href="./patientSearch" className="btn btn-primary mt-4">Search by Patient</a>
                      </div>
                      </div>
                      </div>
                      <div className="col-lg-4">
                      <div className="card card-lift--hover shadow border-0">
                      <div className="card-body py-5">
                          <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                          <i class="fas fa-folder-plus"></i>
                          </div>
                          <h6 className="text-success text-uppercase">Add Prescription</h6>
                          <p className="description mt-3">Create a new patient prescription order that appears on the blockchain.</p>
                          <a href="./prescriptionAdd" className="btn btn-success mt-4">Add a Prescription</a>
                      </div>
                      </div>
                      </div>
                    </div>
                    :
                    user === 'Dispenser' ? 
                    <div className="row row-grid">
                      <div className="col-lg-4">
                      <div className="card card-lift--hover shadow border-0">
                      <div className="card-body py-5">
                          <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                          <i className="fas fa-user"></i> 
                          </div>
                          <h6 className="text-primary text-uppercase">Patient Search</h6>
                          <p className="description mt-3">Search a patient by ID, first name, or last name and view his or her personal prescriptions.</p>
                          <a href="./patientSearch" className="btn btn-primary mt-4">Search by Patient</a>
                      </div>
                      </div>
                      </div>
                      <div className="col-lg-4">
                      <div className="card card-lift--hover shadow border-0">
                      <div className="card-body py-5">
                          <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                          <i className="fas fa-hospital"></i>
                          </div>
                          <h6 className="text-warning text-uppercase">Dispenser Search</h6>
                          <p className="description mt-3">Search a dispenser by ID, name, or location and view all of its corresponding prescriptions.</p>
                          <a href="./dispenserSearch" className="btn btn-warning mt-4">Search by Dispenser</a>
                      </div>
                      </div>
                      </div>
                    </div>
                    :
                    user === 'Government' ?
                    <div className="row row-grid">
                      <div className="col-lg-4">
                      <div className="card card-lift--hover shadow border-0">
                      <div className="card-body py-5">
                          <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                          <i className="fas fa-user"></i> 
                          </div>
                          <h6 className="text-primary text-uppercase">Patient Search</h6>
                          <p className="description mt-3">Search a patient by ID, first name, or last name and view his or her personal prescriptions.</p>
                          <a href="./patientSearch" className="btn btn-primary mt-4">Search by Patient</a>
                      </div>
                      </div>
                      </div>
                      <div className="col-lg-4">
                      <div className="card card-lift--hover shadow border-0">
                      <div className="card-body py-5">
                          <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                          <i className="fas fa-hospital"></i>
                          </div>
                          <h6 className="text-warning text-uppercase">Dispenser Search</h6>
                          <p className="description mt-3">Search a dispenser by ID, name, or location and view all of its corresponding prescriptions.</p>
                          <a href="./dispenserSearch" className="btn btn-warning mt-4">Search by Dispenser</a>
                      </div>
                      </div>
                      </div>
                      <div className="col-lg-4">
                      <div className="card card-lift--hover shadow border-0">
                      <div className="card-body py-5">
                          <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                          <i className="fas fa-user-md"></i>
                          </div>
                          <h6 className="text-success text-uppercase">Prescriber Search</h6>
                          <p className="description mt-3">Search a prescriber by ID, first name, or last name and view his or her prescriptions.</p>
                          <a href="./prescriberSearch" className="btn btn-success mt-4">Search by Prescriber</a>
                      </div>
                      </div>
                      </div>
                    </div>
                    :
                    "" }
              </div>
              </div>
          </div>
      </section>
      </div>
    );
  }
}
export default Home;
