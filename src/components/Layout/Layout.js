import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopNavbar from '../TopNavbar/TopNavbar';
import './Layout.css';

const Layout = ({ children, activeSection, setActiveSection }) => {
  return (
    <div className="layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="layout-main">
        <TopNavbar />
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;