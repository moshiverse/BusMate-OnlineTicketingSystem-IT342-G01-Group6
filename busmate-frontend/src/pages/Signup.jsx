import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const success = await signupUser(email, password);
    if (success) {
      alert('Signup successful! Please login.');
      navigate('/');
    } else {
      alert('Signup failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Signup</button>
      </form>
      <Link to="/">Already have an account? Login</Link>
    </div>
  );
}
