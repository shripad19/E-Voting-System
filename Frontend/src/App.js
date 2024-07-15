import React from "react";
import Home from "./components/Home";
import VerifyAdmin from "./components/VerifyAdmin";
import Admin from './components/Admin';
import Voter from './components/Voter';
import AddVoter from './components/AddVoter';
import ScheduleElection from './components/ScheduleElection';
import AddAdmins from './components/AddAdmins';
import CasteVote from "./components/CasteVote";
import ViewResult from "./components/ViewResult";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { VerificationProvider } from "./VerificationContext";
import VerificationComponent from "./VerificationComponent"; // Assuming you have a VerificationComponent for role-based authentication

const App = () => {
  return (
    <Router>
      <VerificationProvider>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/verify-admin" element={<VerifyAdmin />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<VerificationComponent role="admin"><Admin /></VerificationComponent>} />
          <Route path="/admin/add-voter" element={<VerificationComponent role="admin"><AddVoter /></VerificationComponent>} />
          <Route path="/admin/schedule-election" element={<VerificationComponent role="admin"><ScheduleElection /></VerificationComponent>} />
          <Route path="/admin/add-admins" element={<VerificationComponent role="admin"><AddAdmins /></VerificationComponent>} />
          <Route path="/admin/view-result" element={<VerificationComponent role="admin"><ViewResult /></VerificationComponent>} />
          
          {/* Voter Routes */}
          <Route path="/voter" element={<Voter />} />
          <Route path="/cast-vote" element={<VerificationComponent role="voter"><CasteVote /></VerificationComponent>} />

          {/* Handle other routes or 404 */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </VerificationProvider>
    </Router>
  );
};

export default App;
