import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { loginUser } from "../api/api";

const Login = () => {
    const [form, setForm] = useState({ emailId: "", password: "" });
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response =  await loginUser(form);
            localStorage.setItem("token", document.cookie);
            console.log(response);
            localStorage.setItem("user", JSON.stringify(response.data._id));
            navigate("/");
        } catch (error) {
            console.error("Authentication Error:", error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={form.emailId}
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
                <button type="submit">Login</button>
                <div className="login-footer">
                    <p>
                        Don't have an account?{" "}
                        <a href="/signup">Sign up here</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
