import "./App.css";
import React, { useState, useEffect } from "react";
import Pocetna from "./pages/Pocetna";
import LogIn from "./pages/LogIn"; // Import LogIn page

function App() {
  const [currentPage, setCurrentPage] = useState("pocetna");

  // Set the page based on the URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/login") {
      setCurrentPage("login");
    } else {
      setCurrentPage("pocetna");
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="Header">
          {currentPage === "pocetna" && <Pocetna />} {/* Show Pocetna page */}
          {currentPage === "login" && <LogIn />} {/* Show LogIn page */}
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
