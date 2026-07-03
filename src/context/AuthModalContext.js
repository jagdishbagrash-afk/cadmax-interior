"use client";

import React, { createContext, useContext, useState } from 'react';
import AuthModal from '@/components/AuthModal';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState("login");

  const openAuthModal = (tab = "login") => {
    setAuthModalDefaultTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ isAuthModalOpen, openAuthModal, closeAuthModal, authModalDefaultTab }}>
      {children}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        defaultTab={authModalDefaultTab}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);