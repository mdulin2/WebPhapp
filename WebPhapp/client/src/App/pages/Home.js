import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div className="App">
        <h1>Pharmaceutical Blockchain</h1>
        {/* Link to List.js */}
        <Link to={"./list"}>
          <button variant="raised">My List</button>
        </Link>
        <br />
        <br />
        <Link to={"./prescription"}>
          <button variant="raised">Prescription Row</button>
        </Link>
      </div>
    );
  }
}
export default Home;
