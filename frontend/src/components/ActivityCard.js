import React, { useEffect, useState } from "react";
import "./ActivityCard.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarAlt, faMapMarkerAlt, faRunning, faUser, faFutbol, faBasketballBall, faVolleyballBall, faTableTennis,faEllipsisV,
  faTrash }
   from "@fortawesome/free-solid-svg-icons";

const ActivityCard = ({ activity }) => {
  const { description, date, field, titel, sport, id, NumberOfParticipants, participants, client } = activity;
  const [location, setLocation] = useState("");
  const [sports, setSport] = useState("");
  
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreator, setIsCreator] = useState(false); // Da li je trenutni korisnik kreator
  const [showMenu, setShowMenu] = useState(false); // Prikazuje meni sa tri tačkice


  const initialRemainingSlots =
  NumberOfParticipants - participants.length;
  const [remainingSlots, setRemainingSlots] = useState(initialRemainingSlots);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/client/${client}/username/`
        );
        setUsername(response.data.username);

        // Provera da li je korisnik kreator
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await axios.get(
            "http://127.0.0.1:8000/api/get-user-type-and-id/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsCreator(userResponse.data.id === client);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, [client]);

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

  
  const handleDelete = async () => {
    if (!isCreator) {
      alert("Samo kreator može obrisati ovaj događaj.");
      return;
    }

    const confirmDelete = window.confirm(
      "Da li ste sigurni da želite da obrišete ovaj događaj?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/activities/delete/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Događaj je uspješno obrisan.");
        window.location.reload(); // Osvježavanje liste aktivnosti
      } else {
        throw new Error(response.data.error || "Brisanje nije uspelo.");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Došlo je do greške prilikom brisanja aktivnosti.");
    }
  };

  const handleUsernameClick = (id) => {
    window.location.href = `http://localhost:3000/userprofile/${id}/`;
  };

  const handleLocationClick = (fieldId) => {
    window.location.href = `/teren-profil/${fieldId}`;
  };
  // Funkcija za registraciju na aktivnost
  const handleRegister = async () => {
    if (!isLoggedIn) {
      alert("Morate biti prijavljeni kao rekreativac da biste se prijavili na aktivnost.");
      return;
    }
   
      if (remainingSlots <= 0) {
        alert("Nema slobodnih mesta.");
        return;
      }
  
    
    let pk = {
      id: -1,
      type: ''
    };
    const uri = "http://localhost:8000"
    let currentUserData = {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      profile_picture: '',
    };

    await axios.get(`${uri}/api/get-user-type-and-id/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((request) => {
        pk = request.data;
      })
      .catch((error) => {
        console.error("Error getting ID: ", error);
      });

    if (pk.id !== -1 && pk.type === 'Client') {
      await axios.get(`${uri}/api/client/${pk.id}/`)
        .then(async response => {
          currentUserData = {
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            username: response.data.username,
            email: response.data.email,
            profile_picture: response.data.profile_picture ? uri + response.data.profile_picture : null,
          }
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
          return;
        });
    } else {
      alert("Morate biti prijavljeni kao rekreativac da biste se prijavili na aktivnost.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/activities/${id}/register/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(currentUserData),
      });
      if (response.ok) {
        // Smanji broj slobodnih mesta na frontendu
        setRemainingSlots((prev) => prev - 1);
        alert("Uspešno ste se prijavili na aktivnost!");
      } else {
        const data = await response.json();
        alert(data.error || "Greška pri prijavi.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Došlo je do greške.");
    }finally {
      setIsLoading(false);
    }
  };
  const handleUnregister = async () => {
    if (!isLoggedIn) {
      alert("Morate biti prijavljeni kao rekreativac da biste se prijavili na aktivnost.");
      return;
    }
    let pk = {
      id: -1,
      type: ''
    };
    const uri = "http://localhost:8000"
    let currentUserData = {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      profile_picture: '',
    };

    await axios.get(`${uri}/api/get-user-type-and-id/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((request) => {
        pk = request.data;
      })
      .catch((error) => {
        console.error("Error getting ID: ", error);
      });

    if (pk.id !== -1 && pk.type === 'Client') {
      await axios.get(`${uri}/api/client/${pk.id}/`)
        .then(async response => {
          currentUserData = {
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            username: response.data.username,
            email: response.data.email,
            profile_picture: response.data.profile_picture ? uri + response.data.profile_picture : null,
          }
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
          return;
        });
    } else {
      alert("Morate biti prijavljeni kao rekreativac da biste se prijavili na aktivnost.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/activities/${id}/unregister/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(currentUserData),
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
  const isPastActivity = (activityDate) => {
    const now = new Date(); // Trenutni datum i vreme
    const activityDateTime = new Date(activityDate); // Datum aktivnosti
    return activityDateTime < now; // Provera da li je aktivnost u prošlosti
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

  const sportIcons = {
      fudbal: faFutbol,
      kosarka: faBasketballBall,
      tenis: faTableTennis,
      odbojka: faVolleyballBall,
    };

  return (
    <div className="activity-card">
    <h3 className="activity-card-title">{titel}</h3>
    
    {isCreator && (
        <div className="menu">
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="menu-icon"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="menu-dropdown">
              <button className="menu-button" onClick={handleDelete}>
              <div className="menu-item">
                <FontAwesomeIcon icon={faTrash} className="icon" />
                <span className="label">Obriši</span>
             </div>

              </button>
            </div>
          )}
        </div>
      )}
  
    <p>
      <FontAwesomeIcon icon={faUser} /> <strong> by @</strong>{" "}
      {username ? (
        <span
          className="clickable-username"
          onClick={() => handleUsernameClick(username)}
        >
          {username}
        </span>
      ) : (
        "Nepoznato"
      )}
    </p>
  
    <p>
      <FontAwesomeIcon icon={faRunning} /> {description}
    </p>
    <p>
       <FontAwesomeIcon icon={sportIcons[sports?.toLowerCase()] || faFutbol} />{" "}
       {sports || "Učitavanje..."}
    </p>
    <div className="activity-card-footer">
      <div className="activity-card-footer-left">
        <p>
          <FontAwesomeIcon icon={faCalendarAlt} />  {formattedDate}
        </p>
        <p>
          <FontAwesomeIcon icon={faClock} />  {formattedTime}
        </p>
      </div>
      <div className="activity-card-footer-right">
        <p>
          <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
          <span
            className="clickable-location"
            onClick={() => handleLocationClick(field)}
          >
            {location || "Učitavanje..."}
          </span>
          <p>
            <FontAwesomeIcon icon={faUser} /> Neophodnih:{" "} 
            {remainingSlots|| "Nepoznato"} učesnika
          </p>
    
        </p>
      </div>
    </div>
 
  


      <div className="activity-card-buttons">
        <button
          className="button"
          onClick={handleRegister}
          disabled={remainingSlots <= 0 || isLoading || !isLoggedIn||
            isPastActivity(date)}
        >
          {isLoading ? "Prijava u toku..." : "Prijavi se"}
        </button>
        <button
    className="button unregister-button"
    onClick={handleUnregister}
    disabled={isLoading || !isLoggedIn|| 
      isPastActivity(date) }
  >
    {isLoading && remainingSlots ? "Odjava u toku..." : "Odjavi se"}
  </button>
      </div>
      {isPastActivity(date) && (
  <p className="error-message">Nije moguće prijaviti se na aktivnost koja je već završena.</p>
)}
      {!isLoggedIn && <p className="error-message">Morate biti prijavljeni da biste se prijavili na aktivnost.</p>}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ActivityCard;
