import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">SocialApp</Link>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <span>Welcome, {user}</span>
                            <button onClick={handleLogout} className="navbar-button">Logout</button>
                        </>
                    ) : (
                        <Link to="login" className="navbar-button">Login / Signup</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
