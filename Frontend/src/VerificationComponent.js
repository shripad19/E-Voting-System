//VerificationComponent act as a gatekeeper for protected routes. This component checks the user's verification status and decides whether to allow access, redirect to a verification page, or render nothing if the user is not verified.
import React, { useEffect } from 'react';
import { useVerification } from './VerificationContext';
import { useNavigate } from 'react-router-dom';
 
const VerificationComponent = ({ children, role }) => {
  const { adminVerified, voterVerified } = useVerification();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'admin' && !adminVerified) {
      navigate('/verify-admin');
    } else if (role === 'voter' && !voterVerified) {
      navigate('/voter');
    }
  }, [adminVerified, voterVerified, navigate, role]);

  if ((role === 'admin' && adminVerified) || (role === 'voter' && voterVerified)) {
    return children;
  }
  return null;
};

export default VerificationComponent;

