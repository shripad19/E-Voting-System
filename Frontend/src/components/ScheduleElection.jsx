import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import "../css/ScheduleElection.css";
import Alert, { AlertSuccess } from "./Alert";

export default function ScheduleElection() {
  const [state, setState] = useState("");
  const [assemblyForElection, setAssemblyForElection] = useState("");
  const [status, setStatus] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", party: "", symbol: null }]);

  const navigate = useNavigate();

  const returnHome = (e) => {
    e.preventDefault();
    navigate("/admin");
  };

  useEffect(() => {
    if (status === "ok") {
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = candidates.map((candidate, i) =>
      i === index ? { ...candidate, [field]: value } : candidate
    );
    setCandidates(updatedCandidates);
  };

  const handleFileChange = (index, file) => {
    const updatedCandidates = candidates.map((candidate, i) =>
      i === index ? { ...candidate, symbol: file } : candidate
    );
    setCandidates(updatedCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", party: "", symbol: null }]);
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("state", state);
    formData.append("assemblyForElection", assemblyForElection);
    formData.append("candidatesData", JSON.stringify(candidates)); // Send candidates as JSON
    // Attach candidate data, including their symbol images
    candidates.forEach((candidate, index) => {
      if (candidate.symbol) {
        formData.append("symbols", candidate.symbol); // Match the multer array field
      }
    });
    

    try {
      const response = await fetch('http://localhost:5000/schedule-election', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error("Error scheduling election:", error.stack); // Use error.stack for full details
      res.status(500).json({ status: "error", message: "Failed to schedule election." });
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
          <h1>Schedule Election</h1>
        </div>

        <div className="alerts">
          {status === "ok" && <AlertSuccess />}
        </div>

        <form className="cropSubmitForm" autoComplete="off" onSubmit={onHandleSubmit}>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              id="state"
              placeholder="Enter state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="assemblyForElection" className="form-label">Assembly</label>
            <input
              type="text"
              className="form-control"
              id="assemblyForElection"
              placeholder="Enter assembly"
              value={assemblyForElection}
              onChange={(e) => setAssemblyForElection(e.target.value)}
              autoComplete="off"
            />
          </div>

          {candidates.map((candidate, index) => (
            <div key={index} className="candidateForm">
              <div className="mb-3">
                <label htmlFor={`candidateName-${index}`} className="form-label">Candidate Name</label>
                <input
                  type="text"
                  className="form-control"
                  id={`candidateName-${index}`}
                  placeholder="Enter candidate name"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <label htmlFor={`candidateParty-${index}`} className="form-label">Party</label>
                <input
                  type="text"
                  className="form-control"
                  id={`candidateParty-${index}`}
                  placeholder="Enter party"
                  value={candidate.party}
                  onChange={(e) => handleCandidateChange(index, "party", e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <label htmlFor={`candidateSymbol-${index}`} className="form-label">Party Symbol</label>
                <input
                  type="file"
                  className="form-control"
                  id={`candidateSymbol-${index}`}
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                />
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addCandidate}>
            Add Candidate
          </button>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
    </>
  );
}
