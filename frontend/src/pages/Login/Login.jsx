import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for authentication logic: Simulate successful login
        console.log("Login attempt (Simulated):", { email, password });

        // 1. Set the auth token in localStorage
        localStorage.setItem('cipher_auth_token', 'demo_token_xyz');

        // 2. Redirect to where they came from (or home)
        // Check for 'from' location state or default to '/'
        // NOTE: We'll just navigation to '/' initially for simplicity, but ProtectedRoute can pass state.
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Enter your credentials to access your workspace</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Sign In
                    </button>
                </form>

                <div className="form-footer">
                    <a href="#">Forgot Password?</a>
                    <a href="#">Create Account</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
