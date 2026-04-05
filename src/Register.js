import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import { toast } from 'react-toastify'; 
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [formData, setFormData] = useState({
    fullName: '', 
    profession: '', 
    phone: '', 
    email: '',
    dob: '', 
    age: 0,
    country: '', 
    state: '', 
    city: '',
    password: ''
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates]   = useState([]);
  const [cities, setCities]   = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // --- 1. LOAD COUNTRIES ON STARTUP ---
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // --- 2. CALCULATE AGE AUTOMATICALLY ---
  useEffect(() => {
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
      setFormData(prev => ({ ...prev, age: age >= 0 ? age : 0 }));
    }
  }, [formData.dob]);

  // --- 3. HANDLE INPUT CHANGES ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone Validation (Numbers only, max 10 chars)
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData(prev => ({ ...prev, phone: onlyNums }));
      }
      return; 
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Country Logic: Load States when Country changes
    if (name === 'country') {
      const countryCode = value; 
      setStates(State.getStatesOfCountry(countryCode));
      setCities([]); 
      setFormData(prev => ({ ...prev, country: countryCode, state: '', city: '' }));
    }

    // State Logic: Load Cities when State changes
    if (name === 'state') {
      const stateCode = value;
      setCities(City.getCitiesOfState(formData.country, stateCode));
      setFormData(prev => ({ ...prev, state: stateCode, city: '' }));
    }

    if (name === 'password') calculateStrength(value);
  };

  const calculateStrength = (val) => {
    let strength = 0;
    if (val.length >= 8) strength++;
    if (val.match(/([a-z].*[0-9])|([0-9].*[a-z])/i)) strength++;
    if (val.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'rgba(255,255,255,0.3)';
    if (passwordStrength < 2) return '#ff6b6b'; 
    if (passwordStrength === 2) return '#feca57'; 
    return '#1dd1a1'; 
  };
  
  const getStrengthWidth = () => {
    if (formData.password.length === 0) return '0%';
    if (passwordStrength < 2) return '30%';
    if (passwordStrength === 2) return '60%';
    return '100%';
  };

  // --- SUBMIT FUNCTION ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validation
    if (formData.phone.length !== 10) {
      toast.warn("📱 Please enter a valid 10-digit phone number.");
      return;
    }

    // 2. Convert Codes (US, IN) to Names (United States, India)
    const countryName = Country.getCountryByCode(formData.country)?.name;
    const stateName = State.getStateByCodeAndCountry(formData.state, formData.country)?.name;

    const finalData = {
        ...formData,
        country: countryName || formData.country,
        state: stateName || formData.state
    };
    
    // 3. Send to Backend (Using Port 5000)
    axios.post('http://localhost:5000/api/auth/register', finalData)
        .then(result => {
            // ✅ EXACT MATCH ONLY: Must explicitly say "Success" from backend
            if(result.data.status === "Success") {
                toast.success("✨ Registration Successful! Redirecting...", {
                  icon: "🌿"
                });
                setTimeout(() => navigate('/login'), 2000); 
            } else {
                toast.error("⚠️ Error: " + (result.data.msg || result.data.error || "Registration Failed"));
            }
        })
        .catch(err => {
            console.error(err);
            // Detailed error message if available from server
            const errorMsg = err.response?.data?.msg || err.response?.data?.error || "Server connection failed.";
            toast.error("❌ " + errorMsg);
        });
  };

  return (
    <div className="natural-body">
      <div className="natural-card">
        <div className="natural-header">
          <h2>Join the Path</h2>
          <p>Begin your journey to serenity</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div className="natural-input-group">
            <label>Full Name</label>
            <input type="text" name="fullName" className="natural-input" placeholder="Name " required onChange={handleChange} />
          </div>

          <div className="natural-input-group">
            <label>Profession</label>
            <input type="text" name="profession" className="natural-input" placeholder="Student" required onChange={handleChange} />
          </div>

          <div className="natural-input-group">
            <label>Phone</label>
            <input 
              type="text" 
              name="phone" 
              className="natural-input" 
              placeholder="Phone number" 
              required 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>

          <div className="natural-input-group">
            <label>Email</label>
            <input type="email" name="email" className="natural-input" placeholder="Email ID" required onChange={handleChange} />
          </div>

          <div className="natural-input-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" className="natural-input" required onChange={handleChange} />
          </div>

          <div className="natural-input-group">
            <label>Age</label>
            <input type="text" name="age" className="natural-input" value={formData.age} readOnly />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            
            <div className="natural-input-group">
              <label>Nationality</label>
              <select name="country" className="natural-input" required onChange={handleChange} value={formData.country}>
                <option value="">Select Country</option>
                {countries.map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="natural-input-group">
              <label>State</label>
              <select name="state" className="natural-input" required onChange={handleChange} value={formData.state} disabled={!formData.country}>
                <option value="">Select State</option>
                {states.map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="natural-input-group">
              <label>City</label>
              <select name="city" className="natural-input" required onChange={handleChange} value={formData.city} disabled={!formData.state}>
                <option value="">Select City</option>
                {cities.map((item) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="natural-input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Password</label>
            <input type="password" name="password" className="natural-input" placeholder="Strong Password" required onChange={handleChange} />
            <div style={{ height: '4px', marginTop: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: getStrengthWidth(), backgroundColor: getStrengthColor(), transition: '0.3s' }}></div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" className="natural-btn">REGISTER</button>
            <div className="natural-switch">
              Already have an account? <span onClick={() => navigate('/login')}>Login</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;