import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../Profile.css';
import { login } from './authService.js';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form.username, form.password);
      // on success navigate to the original page
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed', err);
      setError('Login failed. Check credentials and try again.');
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Sign in</h1>
        <p>Use your username and password to sign in.</p>
        <hr />

        <form onSubmit={handleSubmit}>
          <label htmlFor="username"><b>Username or Email</b></label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="username or email"
            required
          />

          <label htmlFor="password"><b>Password</b></label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="password"
            required
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit">Sign in</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
