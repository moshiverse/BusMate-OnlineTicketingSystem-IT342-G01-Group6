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
        // Force a full reload so the root App mounts again and reads localStorage.
        // Replace avoids leaving the redirect URL in the history.
        window.location.replace('/dashboard');
      }).catch(() => {
        // If token validation fails, send user to the auth page.
        navigate('/', { replace: true });
      });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, checkAuth]);

  return <div>Logging you in...</div>;
};

export default OAuthRedirectPage;