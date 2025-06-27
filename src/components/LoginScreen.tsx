import React, { useState } from 'react';
import { initiateSpotifyLogin } from '../services/api';

const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await initiateSpotifyLogin();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Listenfy</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia amet distinctio repudiandae!</p>
      <button
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <span>Connecting...</span>
        ) : (
          <span>Connect to Spotify</span>
        ) }
      </button>
    </div>
  );
};

export default LoginScreen;