import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';
import axios from "axios";

import "./App.css";
import Home from "./Home";
import Patient from "./Patient";
import PatientSearch from "./PatientSearch"
import PrescriptionAdd from "./PrescriptionAdd.js"
import PrescriptionEdit from "./PrescriptionEdit.js"
import Header from "../components/Header.js"

// https://tylermcginnis.com/react-router-pass-props-to-components/ for the ability to pass props through the react router
class App extends Component {

    constructor(props){
      super(props);

      this.state = {user: ''}
      this.authenticate_user();

    }

  // Runs the auth requests and checks to serverside.
  authenticate_user = async () => {

      // Gets the old token to validate. Then, sends back a new one.
      const new_token = await axios.get(`/api/v1/users/reauth`);

      // Gets the public key. Then, verifies the keys correctness.
      fetch('public.pem')
        .then(response => response.text())
        .then(key => {

              const decoded_token = jwt.verify(new_token.data, key);
              if(decoded_token === 'undefined' || decoded_token.role === 'undefined'){
                  this.setState({'user':''});
                  return false
              }

              const role = decoded_token.role;
              this.setState({'user':role});
              return;
        })
        .catch(error => {
            // Likely an error with the verify function above.
            return;
        });
  }


  render() {
    // Decode the token...
    var user = this.state.user;
    const App = () => (

      <div>
        <Header/>
        {user !== '' &&
        <Switch>
          <Route exact path="/" component={() => <Home user={user}/> } />
          <Route path="/patient" component={props => <Patient {...props} user={user} />} />
          <Route path="/patientSearch" component={props =>  <PatientSearch {...props}  user={user}/>} />
          <Route path="/prescriptionAdd" component={props =>  <PrescriptionAdd {...props} user={user}/>}/>
          <Route path="/prescriptionEdit" component={props =>  <PrescriptionEdit {...props} user={user}/>}/>
        </Switch>
        }
      </div>
    );
    return (
      <BrowserRouter>
          <Switch>
            <App />
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
