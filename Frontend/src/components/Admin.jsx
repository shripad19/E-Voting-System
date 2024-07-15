import React from "react";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../Assets/images/admin3.jpg";
import img2 from "../Assets/images/voterlogo.png";
import img3 from "../Assets/images/administratorlogo.png";
import img4 from "../Assets/images/scheduleElection.jpg";
import img5 from "../Assets/images/result2.png";
import "../css/Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  const returnHome = () => {
    navigate("/");
  };

  return (
    <>
      <script src="https://kit.fontawesome.com/dd438282bc.js" crossOrigin="anonymous"></script>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid backIcons">
          <div className="headingExpert">
            <i className="fas fa-circle-left" onClick={returnHome}></i>
          </div>
        </div>
      </nav>

      <div className="admin">

        <header className="admin-header">
          <div className="logo">
            <div className="logoBlock">
              <img src={img1} alt="Admin Logo" />
            </div>
            <div className="logoText">Admin Dashboard</div>
          </div>
        </header>
        <div className="admin-options">
          <div className="imageContainer">
            <Link to="/admin/add-voter">
              <img src={img2} alt="Add Voter" className="responsiveImage" />
            </Link>
            <div className="imageText">Add Voter</div>
          </div>
          <div className="imageContainer">
            <Link to="/admin/schedule-election">
              <img src={img4} alt="Schedule Election" className="responsiveImage" />
            </Link>
            <div className="imageText">Schedule Election</div>
          </div>
          <div className="imageContainer">
            <Link to="/admin/add-admins">
              <img src={img3} alt="Add Admins" className="responsiveImage" />
            </Link>
            <div className="imageText">Add Admins</div>
          </div>
          <div className="imageContainer">
            <Link to="/admin/view-result">
              <img src={img5} alt="View Result" className="responsiveImage" />
            </Link>
            <div className="imageText">View Result</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
