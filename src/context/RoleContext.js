import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("ja"); 

  return (
    <RoleContext.Provider value={{ user, setUser, language, setLanguage }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook for easier access
export const useRole = () => useContext(RoleContext);