import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import { checkAuthStatus } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated } = await checkAuthStatus();
        setIsAuthenticated(isAuthenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      {isAuthenticated ? (
      <Dashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
      <LoginScreen />
      )}
    </div>
  );
}

export default App;