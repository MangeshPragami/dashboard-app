import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopNavbar from '../TopNavbar/TopNavbar';
import './Layout.css';

const Layout = ({ children, activeSection, setActiveSection, user, onLogout }) => {
  // DEBUG: Log what Layout receives and passes
  console.log('🔍 Layout received:', { user: user?.email, onLogout: typeof onLogout });
  
  return (
    <div className="layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="layout-main">
        <TopNavbar user={user} onLogout={onLogout} />
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;