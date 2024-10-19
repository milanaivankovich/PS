import "./Pocetna.css";
import React from "react";
import MenuBar from "../components/MenuBar";

function Pocetna() {
  return (
    <div className="Pocetna">
      <header className="Pocetna-header">
        <div className="Header">
          <MenuBar />
          <div className="content">
            <h1></h1>
            <p></p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Pocetna;
