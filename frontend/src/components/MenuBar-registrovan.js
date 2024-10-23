import React from "react";
import "./MenuBar-registrovan.css";
import logo from "../images/logo.png";
import profileImage from "../images/user.svg";
import SearchComponent from "./Search.js";

const MenuBar = () => {
  return (
    <nav className="menu-bar">
      <div className="menu-left">
        <img src={logo} className="logo" />
        <ul className="menu">
          <li className="menu-item">
            <a href="#pocetna">Početna</a>
          </li>
          <li className="menu-item">
            <a href="tereni">Tereni</a>
          </li>
          <li className="menu-item">
            <a href="dogadjaji">Događaji</a>
          </li>
        </ul>
      </div>
      <div className="menu-right">
        <SearchComponent />
        <a href="userprofile">
          <img src={profileImage} alt="Circular Image" className="user-image" />
        </a>
      </div>
    </nav>
  );
};

export default MenuBar;
