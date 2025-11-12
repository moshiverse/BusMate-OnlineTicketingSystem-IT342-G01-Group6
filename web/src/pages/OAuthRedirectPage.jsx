import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthRedirectPage = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);

      checkAuth().then(() => {
        navigate('/'); // Redirect to homepage
      });
    } else {
      navigate('/login');
    }
  }, [navigate, checkAuth]);

  return <div>Logging you in...</div>;
};

export default OAuthRedirectPage;
