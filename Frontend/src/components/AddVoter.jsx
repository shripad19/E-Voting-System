import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import "../css/ScheduleElection.css";
import Alert, { AlertVoter } from "./Alert";

export default function AddVoter() {
  const [voterId, setVoterId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [assembly, setAssembly] = useState('');
  const [email, setEmail] = useState(''); 
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  let returnHome = async (e) => {//returnHome is an asynchronous function that takes an event object e as its argument. The async keyword indicates that the function may contain asynchronous operations
    e.preventDefault();//to prevent the default behavior of the event like submitting a form
    navigate("/admin");
  }

  useEffect(() => {
    if (status === "ok") {
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 3000);
    }
  }, [status, navigate]);

  let onHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/add-voter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voterId, name, gender, state, assembly, email }),
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
          <h1>Register Voter</h1>
        </div>

        <div className="alerts">
          {status === "ok" && <AlertVoter />}
        </div>

        <form className="cropSubmitForm">
          <div className="mb-3">
            <label htmlFor="voterid" className="form-label">Voter ID</label>
            <input
              type="text"
              className="form-control"
              id="voterId"
              placeholder="Enter voter id"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name of Voter</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} name="gender" id="gender">
              <option value="Select Gender">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              id="state"
              placeholder="Enter State"
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
              value={assembly}
              onChange={(e) => setAssembly(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button onClick={onHandleSubmit} type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
    </>
  );
}