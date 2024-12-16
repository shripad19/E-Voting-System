import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import Alert, { AlertCastedVote } from "./Alert"; // Ensure this is correctly imported
import "../css/CasteVote.css";

export default function CasteVote() {
    const location = useLocation();
    const [voterId, setVoterId] = useState(location.state?.voterId || ''); // Get voterId from navigation state
    const [state, setState] = useState('');
    const [assemblyForElection, setAssemblyForElection] = useState('');
    const [status, setStatus] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    console.log(`voter id from cast-vote ${voterId}`);

    const navigate = useNavigate();

    const returnHome = (e) => {
        e.preventDefault();
        navigate("/");
    }

    useEffect(() => {
        if (status === "ok") {
            const timer = setTimeout(() => {
                navigate("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    const fetchDetailsFromVoterId = async () => {
        try {
            const response = await fetch('http://localhost:5000/get-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ voterId }),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                console.log('Fetched details:', data); // Log the fetched data
                setState(data.state || '');
                setAssemblyForElection(data.assembly || '');
            } else {
                console.error('Error fetching details from voter ID:', data.message);
                setErrorMessage('Error fetching details. Please check voter ID.');
                setState('');
                setAssemblyForElection('');
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            setErrorMessage('Error fetching details. Please check voter ID.');
            setState('');
            setAssemblyForElection('');
        }
    };

    useEffect(() => {
        if (voterId) {
            fetchDetailsFromVoterId();
        }
    }, [voterId]);

    const fetchCandidates = async () => {
        try {
            const response = await fetch('http://localhost:5000/get-candidates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state, assemblyForElection }),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                console.log('Fetched candidates:', data.candidates); // Log the fetched candidates
                setCandidates(data.candidates);
            } else {
                console.error('Error fetching candidates:', data.message);
                setErrorMessage('Error fetching candidates.');
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
            setErrorMessage('Error fetching candidates.');
        }
    };

    useEffect(() => {
        if (state && assemblyForElection) {
            fetchCandidates();
        }
    }, [state, assemblyForElection]);

    const handleCandidateSelect = (candidateName) => {
        console.log('Selected candidate:', candidateName);
        setSelectedCandidate(candidateName);
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        if (!voterId) {
            console.log("Voter id required");
        }
        if (!state) {
            console.log("State required");
        }
        if (!assemblyForElection) {
            console.log("Assembly required");
        }
        if (!selectedCandidate) {
            console.log("Candidate not found");
        }
        if (!voterId || !state || !assemblyForElection || !selectedCandidate) {
            console.log("All fields are required.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/cast-vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ voterId, state, assemblyForElection, selectedCandidate }),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                setStatus('ok');
                setErrorMessage('');
            } else {
                setErrorMessage(data.message || 'Error submitting vote.');
                console.error('Error submitting vote:', data.message);
            }
        } catch (error) {
            setErrorMessage('Error submitting vote.');
            console.error('Error submitting vote:', error);
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
                    <h1>Cast Vote</h1>
                </div>

                {status === "ok" && <AlertCastedVote />}

                <form className="cropSubmitForm">
                    <div className="mb-3">
                        <label htmlFor="voterId" className="form-label">Voter ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="voterId"
                            placeholder="Enter voter ID"
                            value={voterId}
                            readOnly // Make this field read-only since it's passed from Voter.jsx
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <input
                            type="text"
                            className="form-control"
                            id="state"
                            placeholder="Enter state"
                            value={state}
                            readOnly // Read-only since it's fetched automatically
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
                            readOnly // Read-only since it's fetched automatically
                        />
                    </div>
                    {candidates.length > 0 && (
                        <div className="candidateList">
                            <h3>Select a Candidate</h3>
                            {candidates.map((candidate, index) => (
                                <div key={index} className="candidateOption">
                                    <input
                                        type="radio"
                                        id={`candidate-${index}`}
                                        name="candidate"
                                        value={candidate.name}
                                        onChange={() => handleCandidateSelect(candidate.name)}
                                    />
                                    <label htmlFor={`candidate-${index}`}>
                                        <div className="candidateDetails">
                                            <img
                                                src={`http://localhost:5000/${candidate.symbol}`}
                                                alt={`${candidate.party} symbol`}
                                                className="partySymbol"
                                            />
                                            <span>{candidate.name} ({candidate.party})</span>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={onHandleSubmit} type="submit" className="btn btn-primary cast-btn">Submit</button>
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
        </>
    );
}
