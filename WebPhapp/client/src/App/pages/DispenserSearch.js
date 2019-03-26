import React, { Component } from "react";
import { Link } from "react-router-dom";

class DispenserSearch extends Component {
  // Initialize the state
  state = {
    dispenserID: "",
  };

  // Updating text in the dispenser id state
  onKeyDownDispenserID = event => {
      this.setState({dispenserID: String(event.target.value)});
    }

  render() {

    return (
      <div className="col-xl-8 order-xl-1 center">
        <div className="card bg-secondary shadow">
          <div className="card-header bg-white border-0">
            <div className="row align-items-center">
              <div className="col-8 text-left">
                <h3 className="mb-0">Dispenser Search</h3>
              </div>
            </div>
          </div>
          <div className="card-body text-left">
          <div className="form-group">
          <div className="form">
            <div className="form-group mb-3">
              <div className="input-group input-group-alternative">
                <div className="input-group-prepend">
                  <span className="input-group-text"></span>
                </div>
                <input
                  className="form-control"
                  id="patient_id"
                  placeholder="Dispenser ID"
                  type="text"
                  value={this.state.dispenserID}
                  onChange={this.onKeyDownDispenserID}
                  onKeyPress=
                  {event => {
                    if(event.charCode === 13){
                      window.location.href= "./prescriptionRedeem?ID=" + this.state.dispenserID
                    } 
                  }}
                />
              </div>
            </div>
            </div>
            <Link to={"./prescriptionRedeem?ID=" + this.state.dispenserID}>
            <div className="text-center">
              <button type="submit" id="patient_search_button" className="btn btn-icon btn-3 btn-primary">
                <span className="btn-inner--icon"><i className="fas fa-search"></i></span>
                <span className="btn-inner--text">Search</span>
              </button>
            </div>
            </Link>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DispenserSearch;
