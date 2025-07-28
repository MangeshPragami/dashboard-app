import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import UserManagement from './pages/UserManagement';
import IdeasStudies from './pages/IdeasStudies';
import Analytics from './pages/Analytics';
import Surveys from './pages/Surveys';
import SMEMatching from './pages/SMEMatching';
import Settings from './pages/Settings';

function App() {
  const [activeSection, setActiveSection] = useState('user-management');

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
        return <SMEMatching />;
      case 'settings':
        return <Settings />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="app">
      <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
        {renderContent()}
      </Layout>
    </div>
  );
}

export default App;