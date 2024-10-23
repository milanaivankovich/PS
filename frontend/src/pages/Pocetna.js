import "./Pocetna.css";
import React from "react";
import MenuBar from "../components/MenuBar-registrovan";
import Pozadina from "../images/tennis-court-seen-from-air.jpg";

function Pocetna() {
  return (
    <div className="pocetna">
      <header className="pocetna-header">
        <div className="header">
          <MenuBar />
        </div>
      </header>
      <img src={Pozadina} className="velika-pozadina" />
    </div>
  );
}

export default Pocetna;
