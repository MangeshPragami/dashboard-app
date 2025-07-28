import React from 'react';
import './TopNavbar.css';

const TopNavbar = () => {
  return (
    <div className="topnavbar">
      <div className="topnavbar-left">
        <button className="menu-toggle">☰</button>
        <div className="create-dropdown">
          <button className="create-btn">
            Create New ▼
          </button>
        </div>
        <div className="mega-menu">
          <button className="mega-menu-btn">
            Mega Menu ▼
          </button>
        </div>
      </div>
      
      <div className="topnavbar-right">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
        
        <div className="navbar-actions">
          <button className="action-btn">🔍</button>
          <button className="action-btn">⛶</button>
          <button className="action-btn">⊞</button>
          <button className="action-btn flag-btn">🇺🇸</button>
          <button className="action-btn notification-btn">
            🔔
            <span className="notification-badge">2</span>
          </button>
          <div className="user-dropdown">
            <div className="user-avatar">
              <img src="https://via.placeholder.com/32x32/4fc3f7/ffffff?text=G" alt="Geneva" />
              <span className="user-name">Geneva ▼</span>
            </div>
          </div>
          <button className="settings-btn">⚙️</button>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;