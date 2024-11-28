import React, { useState } from 'react';
import axios from 'axios';
import './LogIn.css';
import logo from '../images/logo.png';
import kosarkas from '../images/kosarkas.jpeg';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/login/client/', formData); // Endpoint za login
      console.log('Login successful:', response.data);

      // Spremanje tokena ili korisničkih podataka u lokalnu memoriju
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirekcija korisnika nakon uspješnog logina
      window.location.href = "/"; // Npr., stranica za korisnički panel
    } catch (error) {
      console.error('Login failed:', error);
      setError('Neispravno korisničko ime ili lozinka. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <a href="/">
          <img src={logo} alt="Oće neko na basket?" className="login-logo" />
        </a>
        <h2 className="login-welcome">DOBRODOŠLI!</h2>
        <p>Molimo unesite podatke za prijavu</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Korisničko ime</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Korisničko ime"
            className="login-input"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="password">Lozinka</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Lozinka"
            className="login-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <div className="remember-me-container">
            <div className="checkbox-group">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Zapamti me</label>
            </div>
            <a href="#">Zaboravili ste lozinku?</a>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Prijava...' : 'Prijavi se'}
          </button>
          <button type="button" className="login-btn google">Prijavi se sa Google</button>
          <button type="button" className="login-btn facebook">Prijavi se sa Facebook</button>
          <div className="register-link">
            Nemate nalog? <a href="/registerRekreativac">Registrujte se!</a>
          </div>
        </form>
      </div>
      <div className="image-container">
        <img src={kosarkas} alt="Opis slike" />
      </div>
    </div>
  );
};

export default Login;
