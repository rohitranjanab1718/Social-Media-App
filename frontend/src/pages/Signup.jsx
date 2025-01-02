import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";
import { registerUser } from "../api/api";

const Signup = () => {
    const [form, setForm] = useState({ username: "", emailId: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response =  await registerUser(form);
            console.log(response);
            localStorage.setItem("token", document.cookie);
            localStorage.setItem("user", JSON.stringify(response.data._id));
            alert("Signup successful. Please log in.");
            navigate("/");
        } catch (error) {
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Signup</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, emailId: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <button type="submit">Signup</button>
                <div className="login-footer">
                    <p>
                        Already have an account?{" "}
                        <a href="/auth">Log in here</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Signup;
