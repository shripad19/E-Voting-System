import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import "../css/VerifyAdmin.css";
import Alert, { AlertOtpSent, AlertOtpInvalid, AlertAdminNotRegistered, AlertVoteCasted, AlertLogin } from "./Alert";
import { useVerification } from "../VerificationContext";

export default function VerifyAdmin() {
  const [adminId, setAdminId] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setAdminVerified } = useVerification();

  let returnHome = async (e) => {
    e.preventDefault();
    navigate("/");
  };

  useEffect(() => {
    if (status === "not_registered") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    } else if (status === "registered") {
      setAdminVerified(true); // Set adminVerified to true
      const timer = setTimeout(() => {
        navigate("/admin", { state: { adminId } });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, adminId, navigate, setAdminVerified]);

  let onCheckAdminId = async (e) => {
    e.preventDefault();
    try { 
      const response = await fetch('http://localhost:5000/check-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId }),
      });
      const data = await response.json();
      if (data.status === 'otp_sent') {
        setStep(2);
        setStatus(data.status);
      } else {
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  let onVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/verify-admin-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId, otp }),
      });
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"></link>
      <script src="https://kit.fontawesome.com/dd438282bc.js" crossOrigin="anonymous"></script>

      <nav className="navbar bg-body-tertiary expertNavbar">
        <div className="container-fluid backIcon">
          <div className="headingExpert"><i onClick={returnHome} className="fa-solid fa-circle-left"></i></div>
        </div>
      </nav>

      <div className="submitFormBlock">
        <div className="headingForm">
          <h1>Verify Admin</h1>
        </div>

        <div className="alerts">
          {status === "otp_sent" && <AlertOtpSent />}
          {status === "not_registered" && <AlertAdminNotRegistered />}
          {status === "otp_invalid" && <AlertOtpInvalid />}
          {status === "already" && <AlertVoteCasted />}
          {status === "registered" && <AlertLogin />}
        </div>

        {step === 1 && (
          <form className="cropSubmitForm" onSubmit={onCheckAdminId}>
            <div className="mb-3">
              <label htmlFor="voterid" className="form-label">Admin ID</label>
              <input
                type="text"
                className="form-control"
                id="voterId"
                placeholder="Enter admin id"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        )}

        {step === 2 && (
          <form className="cropSubmitForm" onSubmit={onVerifyOtp}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">OTP</label>
              <input
                type="text"
                className="form-control"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Verify OTP</button>
          </form>
        )}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
    </>
  );
}
