import "./App.css";
import React, { useState, useEffect } from "react";
import Pocetna from "./pages/Pocetna";
import LogIn from "./pages/LogIn"; // Import LogIn page
import Dogadjaji from "./pages/Dogadjaji";

function App() {
  const [currentPage, setCurrentPage] = useState("pocetna");

  // Set the page based on the URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/login") {
      setCurrentPage("login");
    }
    if (path === "/dogadjaji") {
      setCurrentPage("dogadjaji");
    } else {
      setCurrentPage("pocetna");
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="Header">
          {currentPage === "pocetna" && <Pocetna />} {/* Show Pocetna page */}
          {currentPage === "login" && <LogIn />}
          {currentPage === "dogadjaji" && <Dogadjaji />} {/* Show LogIn page */}
        </div>
      </header>
    </div>
  );
}

export default App;
