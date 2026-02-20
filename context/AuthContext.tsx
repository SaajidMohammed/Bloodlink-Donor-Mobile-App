import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// Define the shape of our Authentication State
interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  signIn: (newToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the token from SecureStore when the app starts
  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Failed to load token from storage:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  // Handle Login and save token persistently
  const signIn = async (newToken: string) => {
    try {
      setToken(newToken);
      await SecureStore.setItemAsync('userToken', newToken);
      // Redirect to the main donor dashboard
      router.replace('/(tabs)');
    } catch (e) {
      console.error("Error during sign in storage:", e);
    }
  };

  // Handle Logout and clear storage
  const signOut = async () => {
    try {
      setToken(null);
      await SecureStore.deleteItemAsync('userToken');
      // Return to the login screen
      router.replace('/(auth)/login');
    } catch (e) {
      console.error("Error during sign out storage:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing Auth state in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};