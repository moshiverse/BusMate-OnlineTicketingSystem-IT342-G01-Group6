import React, { useEffect, useState } from 'react';
import { getPayments } from '../api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    getPayments(token).then(setPayments);
  }, [token]);
  if (!token) { window.location = '/'; return null; }
  return (
    <div>
      <h2>Payments</h2>
      <ul>
        {payments.map(p => <li key={p.id}>{JSON.stringify(p)}</li>)}
      </ul>
    </div>
  );
}
