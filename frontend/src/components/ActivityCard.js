import React, { useEffect, useState } from "react";
import "./ActivityCard.css";
import Comments from "./Comments"; // Pretpostavka da je Comments.js u istom direktorijumu

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock, faCalendarAlt, faMapMarkerAlt, faRunning, faUser, faFutbol, faBasketballBall, faVolleyballBall, faTableTennis, faEllipsisV,
  faTrash,
  faEdit
}
  from "@fortawesome/free-solid-svg-icons";
import EditEventCard from "./EditEventCard";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import CommentsSection from "./CommentsSection";

const ActivityCard = ({ activity }) => {
  const { description, date, field, titel, sport, id, NumberOfParticipants, participants, client, duration_hours } = activity;
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
  const [activityParticipants, setActivityParticipants] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showComments, setShowComments] = useState(false); // Praćenje vidljivosti komentara

  // Funkcija za prebacivanje vidljivosti komentara
  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };
  const fetchParticipants = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/activities/${id}/participants/`
      );
      setActivityParticipants(response.data.participants || []); // Postavite učesnike
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };
  useEffect(() => {
    console.log("Updated activityParticipants:", activityParticipants); // Debug log
  }, [activityParticipants]);

  const handleIconClick = () => {
    console.log("Icon clicked!"); // Proveri da li se klik detektuje
    setIsDropdownVisible((prev) => !prev);
    if (!isDropdownVisible) {
      fetchParticipants();
    }
  };
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

  //dohvacanje podataka o kreatoru aktivnosti
  const [creatorUserData, setCreatorUserData] = useState(null);

  useEffect(() => {

    const fetchUserData = async () => {
      await axios.get(`http://localhost:8000/api/client/${client}/`
      ).then(async response => {
        await setCreatorUserData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          username: response.data.username,
          email: response.data.email,
          profile_picture: response.data.profile_picture ? "http://localhost:8000/" + response.data.profile_picture : null,
        })
      }).catch(error => {
        console.error('Error fetching data: ', error);
        alert('Error 404');
      });
    };
    if (client)
      fetchUserData();
  }, [client]);
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
        fetchParticipants();
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
    } finally {
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

      if (response.ok) {
        fetchParticipants();
        // Smanji broj slobodnih mesta na frontendu
        setRemainingSlots((prev) => prev + 1);
        alert("Uspešno ste se odjavili sa aktivnosti!");
      } else {
        const data = await response.json();
        alert(data.error || "Greška pri prijavi.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Došlo je do greške.");
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
    const parseDateTime = (dateString, duration_hours) => {
      // Parse the input date string
      const date = new Date(dateString);
      date.setHours(date.getHours() - 1);
  
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
        
        const endDate = new Date(date);
        endDate.setHours(endDate.getHours() + duration_hours);
  
        const formattedEndTime = endDate
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
  
      return { formattedDate, formattedTime, formattedEndTime};
    };
  
    const { formattedDate, formattedTime,formattedEndTime} = parseDateTime(date, duration_hours);

  const sportIcons = {
    fudbal: faFutbol,
    kosarka: faBasketballBall,
    tenis: faTableTennis,
    odbojka: faVolleyballBall,
  };
  //edit dogadjaja
  const [isEditVisible, setIsEditVisible] = useState(false);
  const toggleEdit = () => {
    setIsEditVisible(!isEditVisible);
    setShowMenu(!showMenu);
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
              <button className="menu-button" onClick={toggleEdit}><FontAwesomeIcon icon={faEdit} />{" "}Uredi</button>
              <button className="menu-button" onClick={handleDelete}><FontAwesomeIcon icon={faTrash} />{" "}Obriši</button>
            </div>
          )}
          {isEditVisible && (
            <div>
              <EditEventCard user={creatorUserData} pk={client} event={activity} closeFunction={toggleEdit} className="new-event-card" />
              {/*<IoIosCloseCircle
              className="close-icon-new-advertisement"
              onClick={() => setIsEditVisible(false)}
            />*/}
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
            <FontAwesomeIcon icon={faClock} />  {formattedTime} - {formattedEndTime}
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
          </p>
          <p>
            <FontAwesomeIcon
              icon={faUser}
              onClick={handleIconClick}
              style={{ cursor: "pointer", marginRight: "10px" }}

            />
            {NumberOfParticipants - remainingSlots || "0"} / {NumberOfParticipants} učesnika
          </p>
          {/* Padajuća lista učesnika */}
          {isDropdownVisible && (
            <div className="participants-list">
              <h4>Učesnici:</h4>
              {activityParticipants.length > 0 ? (
                <ul>
                  {activityParticipants.map((participant, index) => (
                    <li key={index}>
                      <span
                        className="clickable-username"
                        onClick={() => handleUsernameClick(participant)}
                      >
                        @{participant}
                      </span></li>
                  ))}
                </ul>
              ) : (
                <p>Još nema učesnika.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ikonica za komentare */}
      <div className="activity-card-comments-toggle">
        <FontAwesomeIcon
          icon={faComments}
          className="comments-icon"
          onClick={toggleComments}
          style={{ cursor: "pointer", marginTop: "10px" }}
        />
        <span onClick={toggleComments} style={{ cursor: "pointer", marginLeft: "8px" }}>
          {"Prikaži komentare"}
        </span>
      </div>

      {/* Sekcija komentara */}
      {showComments && (
        <CommentsSection id={id} closeFunction={toggleComments} />
      )}

      {!isCreator && <>
        <div className="activity-card-buttons">
          <button
            className="button"
            onClick={handleRegister}
            disabled={remainingSlots <= 0 || isLoading || !isLoggedIn ||
              isPastActivity(date)}
          >
            {isLoading ? "Prijava u toku..." : "Prijavi se"}
          </button>
          <button
            className="button unregister-button"
            onClick={handleUnregister}
            disabled={isLoading || !isLoggedIn ||
              isPastActivity(date)}
          >
            {isLoading && remainingSlots ? "Odjava u toku..." : "Odjavi se"}
          </button>
        </div>
        {isPastActivity(date) && (
          <p className="error-message">Nije moguće prijaviti se na aktivnost koja je već završena.</p>
        )}
        {!isLoggedIn && <p className="error-message">Morate biti prijavljeni da biste se prijavili na aktivnost.</p>}


        {error && <p className="error-message">{error}</p>}
      </>}
    </div>

  );
};

export default ActivityCard;
