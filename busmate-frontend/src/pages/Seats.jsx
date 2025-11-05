import React, { useEffect, useState } from 'react';
import { getSeats } from '../api';

export default function Seats() {
  const [seats, setSeats] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    getSeats(token).then(setSeats);
  }, [token]);
  if (!token) { window.location = '/'; return null; }
  return (
    <div>
      <h2>Seats</h2>
      <ul>
        {seats.map(s => <li key={s.id}>{JSON.stringify(s)}</li>)}
      </ul>
    </div>
  );
}
