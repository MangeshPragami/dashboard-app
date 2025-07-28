import React from 'react';
import './TopNavbar.css';

const TopNavbar = () => {
  return (
    <div className="topnavbar">
      <div className="topnavbar-left">
        {/* Empty - removed all left side items */}
      </div>
      
      <div className="topnavbar-right">
        <div className="navbar-actions">
          <button className="action-btn flag-btn">🇮🇳</button>
          <div className="user-dropdown">
            <div className="user-avatar">
              <img src="https://via.placeholder.com/32x32/4fc3f7/ffffff?text=L" alt="Logout" />
              <span className="user-name">Log Out ▼</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;