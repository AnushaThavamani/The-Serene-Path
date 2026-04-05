import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import './Auth.css'; 

const Login = () => {
  const navigate = useNavigate();
  
  // 1. DEFINE STATE CORRECTLY
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // 2. Destructure here so they are 'defined' for the rest of the component
  const { email, password } = formData; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // email and password are now defined from line 16
    try {
      // Pointing to Port 5000/api/auth/login
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.status === "Success") {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.username || data.user.fullName || 'Traveler'}!`);
        navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        toast.error(data.msg || "⚠️ Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Server connection failed. Is backend on 5000?");
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container">
        <div 
          className="auth-image-side" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop')" }}
        >
          <div className="image-text">
            <h2>The Serene Path</h2>
            <p>Your sanctuary for mindfulness, reflection, and emotional balance.</p>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Your journey continues here.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="auth-input" 
                placeholder="Enter your email" 
                value={email} // Uses the destructured variable
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                className="auth-input" 
                placeholder="Enter your password" 
                value={password} // Uses the destructured variable
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="auth-btn">LOG IN</button>
            <div className="switch-text">
              Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
