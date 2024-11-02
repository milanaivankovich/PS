import React from "react";
import "./SponsoredEventCard.css";
import CreatorImg from "../images/user.svg";

const SponsoredEventCard = () => {
  return (
    <div className="SponsoredEventCard-Okvir">
      <header className="SponsoredEventCard-Header" />
      <div className="SponsoredEventCard-body">
        <div className="SponsoredEventCard-user">
          <img src={CreatorImg} className="creator-image" />
          <div className="Naslov">
            Naziv sponz dogadjaja
            <div className="createdBy"> by @user </div>
          </div>
        </div>
        <div className="Opis">
          Lorem ipsum lorem lorem ipsum lorem ipsum lorem ipsum
        </div>
        <div className="EventCard-buttons">
          <button className="EventCard-button">Pregled</button>
        </div>
      </div>
    </div>
  );
};

export default SponsoredEventCard;
