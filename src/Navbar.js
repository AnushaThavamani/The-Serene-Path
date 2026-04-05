import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="glass-nav">
      {/* Home */}
      <Link 
        to="/" 
        className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`}
        onClick={() => setActiveTab('Home')}
      >
        Home
      </Link>

      {/* Sanctuary (Scroll/Link to Grid) */}
      <a 
        href="#sanctuary" 
        className={`nav-item ${activeTab === 'Sanctuary' ? 'active' : ''}`}
        onClick={(e) => { e.preventDefault(); setActiveTab('Sanctuary'); document.getElementById('sanctuary-grid').scrollIntoView({ behavior: 'smooth' }); }}
      >
        Sanctuary
      </a>

      {/* Wellness Tools Dropdown */}
      <div 
        className="nav-dropdown-wrapper"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <span className={`nav-item dropdown-trigger ${dropdownOpen ? 'active' : ''}`}>
          Wellness Tools ▾
        </span>
        
        {dropdownOpen && (
          <div className="nav-dropdown-menu">
            <Link to="/journal" className="dropdown-link">📖 Journal</Link>
            <Link to="/library" className="dropdown-link">📚 Bibliotherapy</Link>
            <Link to="/media" className="dropdown-link">🎧 Multimedia</Link>
            <Link to="/regulation" className="dropdown-link">🧠 Regulation</Link>
          </div>
        )}
      </div>

      {/* Profile */}
      <Link 
        to="/profile" 
        className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('Profile')}
      >
        Profile
      </Link>
    </nav>
  );
};

export default Navbar;