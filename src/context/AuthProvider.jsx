import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children, session }) => {
  const value = {
    session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
