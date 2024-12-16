// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import '@fortawesome/fontawesome-free/css/all.css';
// import "../css/ViewResult.css";

// export default function ViewResult() {
//   const [state, setState] = useState('');
//   const [assemblyForElection, setAssembly] = useState('');
//   const [status, setStatus] = useState('');
//   const [results, setResults] = useState(null);
//   const [winner, setWinner] = useState(null);
//   const navigate = useNavigate();

//   let returnHome = async (e) => {
//     e.preventDefault();
//     navigate("/admin");
//   };

//   useEffect(() => {
//     if (status === "error" || status ==="no_results") {
//       const timer = setTimeout(() => {
//         navigate("/admin");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [status, navigate]);

//   let onHandleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/view-results', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ state, assemblyForElection }),
//       });
//       const data = await response.json();
//       setStatus(data.status);
//       if (data.status === "ok") {
//         setResults(data.results);
//         setWinner(data.winner);
//       } else {
//         setResults(null);
//         setWinner(null);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setStatus("error");
//       setResults(null);
//       setWinner(null);
//     }
//   };

//   return (
//     <>
//       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"></link>
//       <script src="https://kit.fontawesome.com/dd438282bc.js" crossOrigin="anonymous"></script>

//       <div className="submitFormBlock">
//       <nav className="navbar bg-body-tertiary expertNavbar">
//         <div className="container-fluid backIcon">
//           <div className="headingExpert"><i onClick={returnHome} className="fa-solid fa-circle-left"></i></div>
//         </div>
//       </nav>
//         <div className="headingForm">
//           <h1>View Result</h1>
//         </div>

//         <div className="alerts">
//           {status === "no_results" && <div className="alert alert-warning" role="alert">No results found for the specified state and assembly.</div>}
//           {status === "error" && <div className="alert alert-danger" role="alert">Error fetching results.</div>}
//         </div>

//         <form className="cropSubmitForm" onSubmit={onHandleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="state" className="form-label">State</label>
//             <input
//               type="text"
//               className="form-control"
//               id="state"
//               placeholder="Enter State"
//               value={state}
//               onChange={(e) => setState(e.target.value)}
//               autoComplete="off"
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="assemblyForElection" className="form-label">Assembly</label>
//             <input
//               type="text"
//               className="form-control"
//               id="assemblyForElection"
//               placeholder="Enter Assembly"
//               value={assemblyForElection}
//               onChange={(e) => setAssembly(e.target.value)}
//               autoComplete="off"
//             />
//           </div>
//           <button type="submit" className="btn btn-primary">Submit</button>
//         </form>

//         {results && (
//           <div className="resultsBlock">
//             <h2>Results</h2>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Candidate</th>
//                   <th>Votes</th>
//                 </tr>
//               </thead>
//               {/* <tbody>
//                 {Object.entries(results).map(([candidateName, votes], index) => (
//                   <tr key={index}>
//                     <td>{candidateName}</td>
//                     <td>{votes}</td>
//                   </tr>
//                 ))}
//               </tbody> */}
//               <tbody>
//   {results.map((candidateData, index) => (
//     <tr key={index}>
//       <td>
//         <div className="candidateDetails">
//           <img
//             src={`http://localhost:5000/${candidateData.symbol}`}
//             alt={`${candidateData.candidate} symbol`}
//             className="partySymbol"
//           />
//           <span>{candidateData.candidate}</span>
//         </div>
//       </td>
//       <td>{candidateData.votes}</td>
//     </tr>
//   ))}
// </tbody>


//             </table>
//             <h3>Winner: {winner}</h3>
//           </div>
//         )}
//       </div>
//       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import "../css/ViewResult.css";

export default function ViewResult() {
  const [state, setState] = useState('');
  const [assemblyForElection, setAssembly] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState(null);
  const [winners, setWinners] = useState([]); // For handling multiple winners
  const navigate = useNavigate();

  // Navigate back to the admin page
  const returnHome = (e) => {
    e.preventDefault();
    navigate("/admin");
  };

  useEffect(() => {
    if (status === "error" || status === "no_results") {
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/view-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state, assemblyForElection }),
      });
      const data = await response.json();

      setStatus(data.status);
      if (data.status === "ok") {
        setResults(data.results);
        setWinners(data.winners); // Set the list of winners
      } else {
        setResults(null);
        setWinners([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatus("error");
      setResults(null);
      setWinners([]);
    }
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
            rel="stylesheet" 
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" 
            crossOrigin="anonymous"></link>
      <script src="https://kit.fontawesome.com/dd438282bc.js" crossOrigin="anonymous"></script>

      <div className="submitFormBlock">
        <nav className="navbar bg-body-tertiary expertNavbar">
          <div className="container-fluid backIcon">
            <div className="headingExpert">
              <i onClick={returnHome} className="fa-solid fa-circle-left"></i>
            </div>
          </div>
        </nav>

        <div className="headingForm">
          <h1>View Result</h1>
        </div>

        <div className="alerts">
          {status === "no_results" && <div className="alert alert-warning" role="alert">No results found for the specified state and assembly.</div>}
          {status === "error" && <div className="alert alert-danger" role="alert">Error fetching results.</div>}
        </div>

        <form className="cropSubmitForm" onSubmit={onHandleSubmit}>
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
              placeholder="Enter Assembly"
              value={assemblyForElection}
              onChange={(e) => setAssembly(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

        {results && (
          <div className="resultsBlock">
            <h2>Results</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Votes</th>
                </tr>
              </thead>
              <tbody>
                {results.map((candidateData, index) => (
                  <tr key={index}>
                    <td>
                      <div className="candidateDetails">
                        <img
                          src={`http://localhost:5000/${candidateData.symbol}`}
                          alt={`${candidateData.candidate} symbol`}
                          className="partySymbol"
                        />
                        <span>{candidateData.candidate}</span>
                      </div>
                    </td>
                    <td>{candidateData.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Winner(s): {winners.join(', ')}</h3>
          </div>
        )}
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" 
              integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" 
              crossOrigin="anonymous"></script>
    </>
  );
}
