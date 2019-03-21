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
import Login from "./Login.js"

class App extends Component {


    constructor(props){
      super(props);

      this.state = {user: '',
			        headerToggle: true}

      this.authenticate_user();

    }

  componentDidMount(){
      if(window.location.pathname === '/login'){
          this.setState({headerToggle: false});
      }
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
                  return false;
              }

              const user = decoded_token;
              this.setState({'user':user});
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
        {this.state.headerToggle && <Header/>}

        {/* authenticated routes */ }
        {this.state.user !== '' ?
            <Switch>
              <Route exact path="/" component={() => <Home id={user.sub} user={user.role}/> } />
              <Route path="/patient" component={props => <Patient {...props} id={user.sub} role={user.role} />} />
              <Route path="/patientSearch" component={props =>  <PatientSearch {...props} id={user.sub} role={user.role}/>} />
              <Route path="/prescriptionAdd" component={props =>  <PrescriptionAdd {...props} id={user.sub} role={user.role}/>}/>
              <Route path="/prescriptionEdit" component={props =>  <PrescriptionEdit {...props} id={user.sub} role={user.role}/>}/>
              <Route path="/login" component={Login}/>
            </Switch>
        : <Switch>
            <Route path="/login" component={Login}/>
          </Switch>
        }
      </div>
    );
    return (
      <BrowserRouter>
          <Switch>
            <App/>
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
