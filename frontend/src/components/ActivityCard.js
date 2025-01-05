import React, { useEffect, useState } from "react";
import "./ActivityCard.css";

const ActivityCard = ({ activity }) => {
  const {description, date, field, titel, sport, id, NumberOfParticipants } = activity;
  const [location, setLocation] = useState("");
  const [sports, setSport] = useState("");
  const [remainingSlots, setRemainingSlots] = useState(NumberOfParticipants);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  
    useEffect(() => {
      const fetchUsername = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/client/${id}/username/`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setUsername(data.username);
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      };
  
      fetchUsername();
    }, [id]);
   
  // Dohvaćanje lokacije na osnovu field ID-a
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/advertisement/field/${field}/`);
        const data = await response.json();
        setLocation(data.location);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    if (field) {
      fetchLocation();
    }

    // Provera da li je korisnik prijavljen
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Ako postoji token, korisnik je prijavljen

  }, [field]);

  // Dohvaćanje sporta na osnovu njegovog ID-a
  useEffect(() => {
    const fetchSport = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/sport/${sport}/`);
        const data = await response.json();
        setSport(data.sports);
      } catch (error) {
        console.error("Error fetching sport:", error);
      }
    };

    if (sport) {
      fetchSport();
    }
  }, [sport]);

  // Funkcija za registraciju na aktivnost
  const handleRegister = async () => {
    if (!isLoggedIn) {
      alert("Morate biti prijavljeni da biste se prijavili na aktivnost.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/activities/${id}/register/`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register for the activity");
      }

      const data = await response.json();
      setRemainingSlots(data.remaining_slots);
      alert(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  ///datetime
  const parseDateTime = (dateString) => {
    // Parse the input date string
    const date = new Date(dateString);

    // Format the date as dd/MM/yyyy
    const formattedDate = date
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-")
      .replace(/-/g, "/");

    // Format the time as hh:mm
    const formattedTime = date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = parseDateTime(date);

  return (
    <div className="activity-card">
      <h3 className="activity-card-title">{titel}</h3>
      <p><strong>Kreirao oglas:</strong> {username || "Nepoznato"}</p>
      <p><strong>Opis:</strong> {description}</p>
      <p><strong>Sport:</strong> {sports}</p>
      <p><strong>Datum:</strong> {formattedDate}</p>
      <p><strong>Vrijeme: </strong>{formattedTime}</p>
      <p><strong>Broj preostalih učesnika:</strong> {remainingSlots}</p>
      <p><strong>Lokacija:</strong> {location}</p>

      <div className="activity-card-buttons">
        <button
          className="button"
          onClick={handleRegister}
          disabled={remainingSlots <= 0 || isLoading || !isLoggedIn}
        >
          {isLoading ? "Prijava u toku..." : "Prijavi se"}
        </button>
      </div>

      {!isLoggedIn && <p className="error-message">Morate biti prijavljeni da biste se prijavili na aktivnost.</p>}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ActivityCard;
