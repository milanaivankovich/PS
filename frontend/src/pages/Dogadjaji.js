import React from "react";
import "./Dogadjaji.css";
import MenuBar from "../components/MenuBar.js";

const Dogadjaji = () => {
  return (
    <body>
      <header className="pocetna-header">
        <MenuBar variant={["registered"]} search={true} />
      </header>
      <div>Body</div>
    </body>
  );
};

export default Dogadjaji;
