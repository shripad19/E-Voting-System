// VerificationContext.js
import React, { createContext, useContext, useState } from 'react';

const VerificationContext = createContext();

export const useVerification = () => {
  return useContext(VerificationContext);
};

export const VerificationProvider = ({ children }) => {
  const [adminVerified, setAdminVerified] = useState(false);
  const [voterVerified, setVoterVerified] = useState(false);

  return (
    <VerificationContext.Provider value={{ adminVerified, setAdminVerified, voterVerified, setVoterVerified }}>
      {children}
    </VerificationContext.Provider>
  );
};
