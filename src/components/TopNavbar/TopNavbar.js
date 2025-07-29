import React, { useState, useEffect, useRef } from 'react';
import './TopNavbar.css';

const TopNavbar = ({ user, onLogout }) => {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const nuclearLogout = () => {
    console.log('💥 NUCLEAR LOGOUT INITIATED');
    
    // Clear ALL storage
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Clear React state by forcing a complete page reload
      window.location.replace(window.location.origin);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Last resort - just reload
      window.location.reload(true);
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚪 Logout attempt started');
    
    if (window.confirm('Are you sure you want to log out?')) {
      // Try normal logout first
      if (onLogout && typeof onLogout === 'function') {
        console.log('✅ Trying normal logout');
        try {
          onLogout();
          // If normal logout doesn't work within 1 second, force it
          setTimeout(() => {
            console.log('⏰ Normal logout timeout - forcing nuclear logout');
            nuclearLogout();
          }, 1000);
        } catch (error) {
          console.error('Normal logout failed:', error);
          nuclearLogout();
        }
      } else {
        console.log('❌ No logout function - going nuclear immediately');
        nuclearLogout();
      }
    }
    setShowLogoutMenu(false);
  };

  return (
    <div className="topnavbar">
      <div className="topnavbar-left">
        {/* Empty - removed all left side items */}
      </div>
      
      <div className="topnavbar-right">
        <div className="navbar-actions">
          <button className="action-btn flag-btn">🇮🇳 IN</button>
          <div 
            className="user-dropdown" 
            ref={dropdownRef}
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
          >
            <div className="user-avatar">
              <img src="https://via.placeholder.com/32x32/ffffff/000000?text=A" alt="Admin" />
              <span className="user-name">
                {user?.name || 'Admin'} ▼
              </span>
            </div>
            {showLogoutMenu && (
              <div className="logout-menu">
                <div className="user-info">
                  <div className="user-email">{user?.email || 'admin@outlaw.com'}</div>
                  <div className="user-role">{user?.role || 'Administrator'}</div>
                </div>
                <div className="menu-divider"></div>
                
                <button 
                  className="logout-btn" 
                  onClick={handleLogoutClick}
                  style={{ cursor: 'pointer' }}
                >
                  🚪 Log Out
                </button>
                
                {/* NUCLEAR OPTION */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('💥 NUCLEAR BUTTON CLICKED');
                    nuclearLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginTop: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  💥 NUCLEAR LOGOUT
                </button>
                
                {/* EMERGENCY RELOAD */}
                <button 
                  onClick={() => {
                    console.log('🔄 EMERGENCY RELOAD');
                    window.location.reload(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginTop: '3px',
                    cursor: 'pointer'
                  }}
                >
                  🔄 RELOAD PAGE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;