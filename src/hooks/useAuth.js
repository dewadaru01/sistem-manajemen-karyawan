import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for sign-in state changes
    const updateSigninStatus = (isSignedIn) => {
      setIsSignedIn(isSignedIn);
      
      if (isSignedIn && window.gapi?.auth2) {
        const googleUser = window.gapi.auth2.getAuthInstance().currentUser.get();
        const profile = googleUser.getBasicProfile();
        
        setUser({
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          imageUrl: profile.getImageUrl()
        });
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };

    // Check if already signed in
    if (window.gapi?.auth2) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) {
        updateSigninStatus(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(updateSigninStatus);
      }
    }

    return () => {
      if (window.gapi?.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance) {
          authInstance.isSignedIn.listen(() => {});
        }
      }
    };
  }, []);

  const signIn = async () => {
    try {
      await window.gapi.auth2.getAuthInstance().signIn();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await window.gapi.auth2.getAuthInstance().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    isSignedIn,
    user,
    isLoading,
    signIn,
    signOut
  };
};