import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function getProfile() {
      if (!token) return;
      const result = await fetchProfile(token);
      setProfile(result);
    }
    getProfile();
  }, [token]);

  if (!token) {
    window.location = '/';
    return null;
  }
  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Name: {profile.name}</p>
      {/* add more fields as needed */}
    </div>
  );
}
