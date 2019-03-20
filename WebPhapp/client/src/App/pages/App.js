import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";

import Patient from "./Patient";
import PatientSearch from "./PatientSearch"
import PrescriptionAdd from "./PrescriptionAdd.js"
import PrescriptionEdit from "./PrescriptionEdit.js"
import Header from "../components/Header.js"
import Login from "./Login.js"

class App extends Component {
  state = {
    headerToggle: true
  };

  componentDidMount() {
    if (window.location.pathname === '/login') {
      this.setState({headerToggle: false})
    }
  }
  render() {
    const App = () => (
      <div>
        {this.state.headerToggle && <Header/>}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login}/>
          <Route path="/patient" component={Patient} />
          <Route path="/patientSearch" component={PatientSearch} />
          <Route path="/prescriptionAdd" component={PrescriptionAdd}/>
          <Route path="/prescriptionEdit" component={PrescriptionEdit}/>
        </Switch>
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
