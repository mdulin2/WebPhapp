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
      // Validate the token
      // TODO Warning: Should be a verify...
      // Check for errors
      const decoded_token = jwt.decode(new_token.data);
      if(decoded_token === 'undefined' || decoded_token.role === 'undefined'){
          this.setState({'user':''});
          return false
      }

      const role = decoded_token.role;

      const cookies = new Cookies();

      // TODO httpOnly and sameSite attribute
      // this needs to be set on the serverside... did not know that!
      cookies.set('auth_token', new_token.data, { path: '/'});
      this.setState({'user':role});
      return role;
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
