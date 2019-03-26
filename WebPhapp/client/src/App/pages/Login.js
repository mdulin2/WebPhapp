import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
    // Initialize the state
    state = {
        userID: "",
        password: "",
        isError: false
    };

    // Updating value in userID state
    onKeyDownUserID = event => {
        this.setState({userID: event.target.value, isError: false});
    }

    // Updating value in password state
    onKeyDownPassword = event => {
        this.setState({password: event.target.value, isError: false});
    }

    // Authenticating user's credentials to login
    onClickUserLogin = () => {
      var loginQuery= `/api/v1/users/login`;

      /* Send a message back for an error or a success */
      axios
        .post(loginQuery,{
          "username": this.state.userID,
          "password": this.state.password
          }).then(response => {
            window.location.href= "./"
          }).catch(error => {
            console.log("Error: Authentication"); 
            this.setState({isError: true});
          });
      // if successful, then redirect.
      
    }

    render() {
        return(
          <div className="App">
          <div className="main-content">

          {/* Navbar */}
          <nav className="navbar navbar-top navbar-horizontal navbar-expand-md navbar-dark">
            <div className="container px-4">
              <a className="navbar-brand">
                <img src="../assets/img/brand/pharmachain-white.png"/>
              </a>
              <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbar-collapse-main" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="navbar-collapse collapse" id="navbar-collapse-main">

                {/* Collapse header */}
                <div className="navbar-collapse-header d-md-none">
                  <div className="row">
                    <div className="col-6 collapse-brand">
                      <img src="../assets/img/brand/pharmachain-blue.png"/>
                    </div>
                    <div className="col-6 collapse-close">
                      <button type="button" className="navbar-toggler collapsed" data-toggle="collapse" data-target="#navbar-collapse-main" aria-controls="sidenav-main" aria-expanded="false" aria-label="Toggle sidenav">
                        <span></span>
                        <span></span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Navbar items */}
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <a className="nav-link nav-link-icon" href="./login">
                      <i className="ni ni-circle-08"></i>
                      <span className="nav-link-inner--text">Login</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link nav-link-icon" href="./login">
                      <i className="fas fa-user-plus"></i>
                      <span className="nav-link-inner--text">Register</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* Header */}
        <div className="header bg-gradient-primary py-7 py-lg-8">
        <div className="container">
          <div className="header-body text-center mb-7">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6">
                <h1 className="text-white">Welcome to Pharmachain!</h1>
                <p className="text-lead text-light">Pharmachain is a cross-company data management web application that stores prescription data as a history of anonymized transactions on a blockchain.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Page content */}
        <div className="container mt--8 pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card bg-secondary shadow border-0">
              <div className="card-body px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Sign in with credentials below</small>
                </div>
                <form role="form">
                  <div className="form-group mb-3">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="ni ni-circle-08"></i></span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="User ID"
                        onChange={this.onKeyDownUserID}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="ni ni-lock-circle-open"></i></span>
                      </div>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        onChange={this.onKeyDownPassword}
                      />
                    </div>
                  </div>
                  {/* TODO: Remember Me */}
                  {/* <div className="custom-control custom-control-alternative custom-checkbox">
                    <input className="custom-control-input" id="remember-me-check" type="checkbox"/>
                    <label className="custom-control-label" for="remember-me-check">
                      <span className="text-muted">Remember me</span>
                    </label>
                  </div> */}
                  {this.state.isError ? 
                  <div className="alert alert-danger alert-dismissible text-center px-3 py-2" role="alert">
                    <span><small><i className="fas fa-exclamation-circle">&nbsp;</i></small></span>
                    <span><small><strong> ERROR: </strong>Invalid login credentials. Please try again.</small></span>
                  </div>
                  :
                  <br/>
                  }
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-block btn-primary my-4"
                      onClick={this.onClickUserLogin}>
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* TODO: Implement a forgot password page and create account page */}
            <div className="row mt-3">
              <div className="col-6 text-left">
                <a href="./login" className="text"><small>Forgot password?</small></a>
              </div>
              <div className="col-6 text-right">
                <a className="text-light"><small>Don't have an account? </small></a>
                <a href="./login"><small><strong>Sign up</strong></small></a>
              </div>
            </div>

          </div>
        </div>
        </div>

        {/* Footer */}
        <footer className="py-5">
          <div className="container">
            <div className="row align-items-center justify-content-xl-between">
              <div className="col-xl-6">
                <div className="copyright text-center text-xl-left text-muted">
                  © 2019 <a className="font-weight-bold ml-1">Pharmachain</a>
                </div>
              </div>
              <div className="col-xl-6">
                <ul className="nav nav-footer justify-content-center justify-content-xl-end">
                  <li className="nav-item">
                    <a href="https://www.gonzaga.edu/school-of-engineering-applied-science/student-experiences/cede/senior-design-projects/cpsc#CPSC 03, ENSC 55" className="nav-link" target="_blank">About Us</a>
                  </li>
                  <li className="nav-item">
                    <a href="https://github.com/Pharmachain/WebPhapp" className="nav-link" target="_blank">Github</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

      </div>
      );
    }
}

export default Login;
