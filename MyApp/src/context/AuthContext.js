import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthAPI, getStoredUser } from '../api/apiService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Check stored login on app start
  useEffect(() => {
    (async () => {
      try {
        const stored = await getStoredUser();
        if (stored) setUser(stored);
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const data = await AuthAPI.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (full_name, email, mobile, password, password2) => {
    const data = await AuthAPI.register(full_name, email, mobile, password, password2);
    // Auto login after register
    await AsyncStorage.setItem('access_token',  data.access);
    await AsyncStorage.setItem('refresh_token', data.refresh);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = async (navigation) => {
    await AuthAPI.logout();
    setUser(null);
    navigation.replace('Login');
  };

  const updateUser = (updated) => {
    setUser(prev => ({ ...prev, ...updated }));
    AsyncStorage.setItem('user', JSON.stringify({ ...user, ...updated }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);