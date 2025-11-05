import React, { useEffect, useState } from 'react';
import { getBuses } from '../api';

export default function Buses() {
  const [buses, setBuses] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    getBuses(token).then(setBuses);
  }, [token]);
  if (!token) { window.location = '/'; return null; }
  return (
    <div>
      <h2>Buses</h2>
      <ul>
        {buses.map(b => <li key={b.id}>{JSON.stringify(b)}</li>)}
      </ul>
    </div>
  );
}
