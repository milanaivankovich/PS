import React from "react";
import "./MenuBar.css";
import logo from "../images/logo.png";

const MenuBar = () => {
  return (
    <nav className="menu-bar">
      <img src={logo} className="logo" />
      <ul className="menu">
        <li className="menu-item">
          <a href="#pocetna">Početna</a>
        </li>
        <li className="menu-item">
          <a href="tereni">Tereni</a>
        </li>
        <li className="menu-item">
          <a href="#dogadjaji">Događaji</a>
        </li>
      </ul>
    </nav>
  );
};

export default MenuBar;
