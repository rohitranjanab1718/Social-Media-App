import React, { useState } from "react";
import { login, signup } from "../api/api";

const Auth = ({ isLogin }) => {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = isLogin ? await login(form) : await signup(form);
            localStorage.setItem("token", res.data.token);
            window.location.href = "/";
        } catch (error) {
            console.error(error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
            <button type="submit">{isLogin ? "Login" : "Signup"}</button>
        </form>
    );
};

export default Auth;
