export default function Dashboard() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location = '/';
    return null;
  }
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome! You are logged in.</p>
      {/* Add more content here */}
    </div>
  );
}
