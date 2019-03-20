import React, { Component } from 'react';

class CancelAlert extends Component {
    render() {
        return (
            <div className="col-8 center text-center">
            <div className="alert alert-danger" role="alert">
              <span className="alert-inner--text"><strong>CANCELLED: </strong> Prescription cancelled from Pharmachain.</span>
            </div>
          </div>
        );
    }

}

export default CancelAlert;