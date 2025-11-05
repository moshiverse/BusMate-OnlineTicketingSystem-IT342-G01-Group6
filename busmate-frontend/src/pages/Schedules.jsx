import React, { useEffect, useState } from 'react';
import { getSchedules } from '../api';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    getSchedules(token).then(setSchedules);
  }, [token]);
  if (!token) { window.location = '/'; return null; }
  return (
    <div>
      <h2>Schedules</h2>
      <ul>
        {schedules.map(s => <li key={s.id}>{JSON.stringify(s)}</li>)}
      </ul>
    </div>
  );
}
