import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import "../css/ScheduleElection.css";
import Alert, { AlertSuccess } from "./Alert";

export default function ScheduleElection() {
  const [state, setState] = useState("");
  const [assemblyForElection, setAssemblyForElection] = useState("");
  const [status, setStatus] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", party: "" }]);

  const navigate = useNavigate();
  let returnHome = async (e) => {
    e.preventDefault();
    navigate("/admin");
  }

  useEffect(() => {
    if (status === "ok") {
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const handleCandidateChange = (index, field, value) => {//to handle changes to the properties of a specific candidate in a list of candidates
    const updatedCandidates = candidates.map((candidate, i) =>
      i === index ? { ...candidate, [field]: value } : candidate
    );
    setCandidates(updatedCandidates);
  }

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", party: "" }]);//The spread operator is used to create a new array that includes all the elements of the existing candidates array.
  }

  let onHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/schedule-election', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state, assemblyForElection, candidates }),
      });
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error('Error fetching data:', error);
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

        <form className="cropSubmitForm" autoComplete="off">
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

          {/* Below code maps over a list of candidates and renders a form for each candidate.  */}
          {/* The candidates array is mapped over, meaning that for each candidate in the array, the code inside the map function is executed.
          The map function takes two parameters: candidate (the current candidate object) and index (the current index of the candidate in the array). */}
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
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addCandidate}>
            Add Candidate
          </button>
          <button onClick={onHandleSubmit} type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
    </>
  );
}
