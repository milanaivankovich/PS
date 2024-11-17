import React, { useState } from "react";
import "./RegisterRekreativac.css";
import logo from '../images/logo.png';


function RegisterRekreativac() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Molimo popunite sva polja prije nastavka.");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.firstName && formData.lastName && formData.username;
      case 1:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
      case 2:
        return formData.email;
      default:
        return false;
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const submitForm = () => {
    if (isStepValid()) {
      alert("Registracija uspješna! Verifikujte email.");
    }
  };

  return (
    <div className="register-container">
      <a href="/" className="logo-container">
        <img src={logo} alt="Oće neko na basket?" className="basket-logo" />
      </a>

      <div id="form-container">
        <h1 className="welcome-title">Dobrodošli!</h1>
        {currentStep === 0 && (
          <div className="form-step active">
            <p>Molimo unesite podatke</p>
            <label htmlFor="firstName">Ime:</label>
            <input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} required />
            <label htmlFor="lastName">Prezime:</label>
            <input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} required />
            <label htmlFor="username">Korisničko ime:</label>
            <input type="text" id="username" value={formData.username} onChange={handleInputChange} required />
            <button className="continue-button" onClick={nextStep}>
              Nastavi
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="form-step">
            <p>Molimo unesite i potvrdite lozinku</p>
            <label htmlFor="password">Lozinka:</label>
            <input type="password" id="password" value={formData.password} onChange={handleInputChange} required />
            <label htmlFor="confirmPassword">Potvrdite lozinku:</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button className="continue-button" onClick={nextStep}>
              Nastavi
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <p>Molimo unesite svoju email adresu za verifikaciju</p>
            <label htmlFor="email">Email adresa:</label>
            <input type="email" id="email" value={formData.email} onChange={handleInputChange} required />
            <button className="continue-button" onClick={submitForm}>
              Završi registraciju
            </button>
          </div>
        )}

        <div className="social-buttons">
          <button className="social-button facebook-button">Registrujte se putem Facebook-a</button>
          <button className="social-button email-button">Registrujte se putem Email-a</button>
        </div>

        <div className="login-prompt">
          <p>
            Imate nalog?{" "}
            <a href="/login" className="login-link">
              Prijavite se!
            </a>
          </p>
        </div>
      </div>

      <div className="progress-bar">
        <div className="steps">
          <div className={`step ${currentStep >= 0 ? "active" : ""}`}>
            <div className="step-circle">1</div>
            <p>Unesite podatke</p>
          </div>
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-circle">2</div>
            <p>Unesite lozinku</p>
          </div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-circle">3</div>
            <p>Verifikujte email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterRekreativac;
