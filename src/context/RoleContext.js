import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("ja"); 

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <RoleContext.Provider value={{ user, setUser, clearUser, language, setLanguage }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook for easier access
export const useRole = () => useContext(RoleContext);
