import React, { Component } from 'react';

class CancelAlert extends Component {
    render() {
      // User role from log in
      const user = this.props.role; 
        return (
          <div>
          {user === 'Prescriber' || user === 'Dispenser' || user === 'Admin' ?
            <div className="col-8 center text-center">
            <div className="alert alert-danger" role="alert">
              <span className="alert-inner--text"><strong>CANCELLED: </strong> Prescription cancelled from Pharmachain.</span>
            </div>
            </div>
            :
            "Not authorized :(" }
          </div>
        );
    }

}

export default CancelAlert;