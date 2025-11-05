import React, { useEffect, useState } from 'react';
import { getRoutes } from '../api';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    getRoutes(token).then(setRoutes);
  }, [token]);
  if (!token) { window.location = '/'; return null; }
  return (
    <div>
      <h2>Routes</h2>
      <ul>
        {routes.map(r => <li key={r.id}>{JSON.stringify(r)}</li>)}
      </ul>
    </div>
  );
}
