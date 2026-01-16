import React from 'react';
import './Navbar.scss';

interface NavbarProps {
  isLoggedIn: boolean;
  onToggleLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onToggleLogin }) => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="brand">
          <span className="brand-icon">👑</span>
          <h1>Laundry King</h1>
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="profile-section">
              <span className="user-greeting">Welcome back, King!</span>
              <button className="btn btn-outline profile-btn">
                <span className="avatar">👤</span>
                PROFILE
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onToggleLogin}>
              LOGIN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
