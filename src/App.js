// src/App.js
import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import Login from './pages/Login'; // Your existing Login component
import UserManagement from './pages/UserManagement';
import IdeasStudies from './pages/IdeasStudies';
import Analytics from './pages/Analytics';
import Surveys from './pages/Surveys';
import SMEInformation from './pages/SMEInformation'; // Updated import
import Settings from './pages/Settings';

function App() {
  const [user, setUser] = useState(null); // Track authentication state
  const [activeSection, setActiveSection] = useState('user-management');

  // Handle login - called from Login component
  const handleLogin = (userData) => {
    console.log('Login successful:', userData);
    setUser(userData);
  };

  // Handle logout - called from Layout/TopNavbar
  const handleLogout = () => {
    console.log('Logging out...');
    setUser(null);
    setActiveSection('user-management'); // Reset to default section
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'user-management':
        return <UserManagement />;
      case 'ideas-studies':
        return <IdeasStudies />;
      case 'analytics':
        return <Analytics />;
      case 'surveys':
        return <Surveys />;
      case 'sme-matching':
        return <SMEInformation />; // Updated component
      case 'settings':
        return <Settings />;
      default:
        return <UserManagement />;
    }
  };

  // Show login page if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Show main app if user is authenticated
  return (
    <div className="app">
      <Layout 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        user={user}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
    </div>
  );
}

export default App;