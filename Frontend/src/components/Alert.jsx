import React from "react";
import "../css/Alert.css";
function AlertSuccess() {
    return (
        <>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"></link>
            <div className="alert alert-success successAlert" role="alert" >
                Data submitted successfully!!
            </div>
        </>
    );
}
function AlertVoter() {
    return (
        <>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"></link>
            <div className="alert alert-success successAlert" role="alert" >
                Voter registered successfully!!
            </div>
        </>
    );
}
function AlertVoterNotRegistered() {
    return (
      <div className="alert alert-danger" role="alert">
        Voter not registered.
      </div>
    );
  }

  function AlertOtpSent() {
    return (
      <div className="alert alert-success" role="alert">
        OTP Sent successfully!
      </div>
    );
  }
  function AlertLogin() {
    return (
      <div className="alert alert-success" role="alert">
        Login successful!
      </div>
    );
  }
  function AlertOtpInvalid() {
    return (
      <div className="alert alert-danger" role="alert">
        Invalid OTP!
      </div>
    );
  }
  function AlertCastedVote() {
    return (
      <div className="alert alert-success" role="alert">
        Vote casted successfully!
      </div>
    );
  }
  function AlertVoteCasted() {
    return (
      <div className="alert alert-warning" role="alert">
        Already casted the vote!
      </div>
    );
  }
  function AlertAdmin() {
    return (
      <div className="alert alert-success" role="alert">
        Admin registered successfully!
      </div>
    );
  }
  function AlertAdminNotRegistered() {
    return (
      <div className="alert alert-danger" role="alert">
        Invaild Admin ID!
      </div>
    );
  }
export {
    AlertSuccess, AlertVoter, AlertVoterNotRegistered, AlertOtpSent, AlertOtpInvalid, AlertCastedVote, AlertVoteCasted, AlertAdmin, AlertAdminNotRegistered, AlertLogin
}