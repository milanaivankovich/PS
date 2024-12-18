import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./SearchFields.css";
import Icon from "../images/iconMagnifier.svg";

const SearchFieldsComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/fields/")
      .then((response) => {
        setAllFields(response.data);
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Greška prilikom dohvatanja lokacija:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(allFields);
    } else {
      const filteredResults = allFields.filter((field) =>
        field.location.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    }
  }, [query, allFields]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFieldClick = (id) => {
    window.location.replace(`/teren-profil/${id}`);
  };

  return (
    <>
      <form className="searchContainer" role="search" ref={searchRef}>
        <div className="searchContent">
          <img src={Icon} alt="" className="searchIcon" />
          <input
            type="search"
            id="searchInput"
            className="searchInput"
            placeholder="Pretraga terena..."
            aria-label="Pretraga terena i korisnika"
            value={query}
            onFocus={() => setShowResults(true)}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      {showResults && (
        <div className="comboBox">
          {loading ? (
            <p className="loadingMessage">Učitavanje...</p>
          ) : results.length > 0 ? (
            <ul className="comboBoxList">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="comboBoxItem"
                  onMouseDown={() => handleFieldClick(item.id)}
                >
                  <div>{item.location}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nema rezultata za "{query}"</p>
          )}
        </div>
      )}
    </>
  );
};

export default SearchFieldsComponent;