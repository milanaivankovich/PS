import "./App.css";
import React from "react";
import Pocetna from "./pages/Pocetna";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        */}
        {/*
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> 
        */}
        <div className="Header">
          <Pocetna /> {/* Add the MenuBar component here */}
          <div className="content">
            <h1></h1>
            <p></p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
