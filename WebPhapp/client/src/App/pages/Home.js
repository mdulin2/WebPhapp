import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div className="App">
        <h1>Pharmaceutical Blockchain</h1>
        {/* Link to PatientSearch.js */}
        <Link to={"./patientSearch"}>
          <div className="text-center">
            <button 
              type="button" 
              className="btn btn-primary my-4"
              variant="raised">
              Patient Search
            </button>
          </div>
        </Link>
      </div>
    );
  }
}
export default Home;
