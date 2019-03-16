import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';

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

      this.authenticate_user();
      var user = 'Prescriber';
      this.state = {
          user: user
      }
  }

  authenticate_user = () => {
      const cookies = new Cookies();
      const user = cookies.get('auth_token');

      // Validate the token
      const role = jwt.decode(user).role;
      
      // Set the token as a cookie
      // Decode the token.
      // Return the user type
  }

  compo
  render() {
    // Decode the token...
    var user = this.state.user;
    const App = () => (

      <div>
        <Header/>
        <Switch>
          <Route exact path="/" component={() => <Home user={user}/> } />
          <Route path="/patient" component={props => <Patient {...props} user={user} />} />
          <Route path="/patientSearch" component={props =>  <PatientSearch {...props}  user={user}/>} />
          <Route path="/prescriptionAdd" component={props =>  <PrescriptionAdd {...props} user={user}/>}/>
          <Route path="/prescriptionEdit" component={props =>  <PrescriptionEdit {...props} user={user}/>}/>
        </Switch>
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
