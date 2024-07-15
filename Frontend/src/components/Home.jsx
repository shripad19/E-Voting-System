import React from "react";
import { Link } from 'react-router-dom';
import img1 from "../Assets/images/admin3.jpg";
import img2 from "../Assets/images/voterlogo.png";
import img3 from "../Assets/images/homelogo.png";
import "../css/Home.css";

export default function Home() {
    return (
        <>
            <header>
                <div className="logo">
                    <div className="logoBlock"><img src={img3} alt="Home Logo" /></div>
                    <div className="logoText">E Voting System</div>
                </div>
            </header>
            <div className="introText">
                <p>Welcome to the E Voting System. Please choose your role to login.</p>
            </div>
            <div className="mainbox">
                <div className="imageContainer">
                    <Link to="/verify-admin">
                        <img src={img1} alt="Admin" className="responsiveImage" />
                    </Link>
                    <div className="imageText">Admin</div>
                </div>
               <div className="imageContainer">
                    <Link to="/voter">
                        <img src={img2} alt="Voter Logo" className="responsiveImage" />
                    </Link>
                    <div className="imageText">Voter</div>
                </div>
            </div>
        </>
    );
}
