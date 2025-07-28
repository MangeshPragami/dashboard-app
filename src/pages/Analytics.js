// src/pages/AnalyticsDashboard.js
import React, { useState } from 'react';
import '../App.css';
import OverviewDashboard from '../analytics/OverviewDashboard';
import CreatorMetrics from '../analytics/CreatorMetrics';
import SMEMetrics from '../analytics/SMEMetrics';
import IdeaMetrics from '../analytics/IdeaMetrics';
import { FormMetrics, BookingMetrics } from '../analytics/FormMetrics';
import AnalyticsDebugger from '../analytics/AnalyticsDebugger';

const AnalyticsDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const navigationItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'creators', label: 'Creators' },
    { key: 'sme', label: 'SMEs' },
    { key: 'ideas', label: 'Ideas' },
    { key: 'forms', label: 'Forms' },
    { key: 'bookings', label: 'Sessions' },
    { key: 'debug', label: 'Debug' }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewDashboard />;
      case 'creators':
        return <CreatorMetrics />;
      case 'sme':
        return <SMEMetrics />;
      case 'ideas':
        return <IdeaMetrics />;
      case 'forms':
        return <FormMetrics />;
      case 'bookings':
        return <BookingMetrics />;
      case 'debug':
        return <AnalyticsDebugger />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="App">
      <header className="analytics-header-professional">
        <div className="header-content-professional">
          <div className="header-title-professional">
            <h1>Outlaw Analytics</h1>
            <p>Real-time platform performance insights</p>
          </div>
          <nav className="analytics-nav-professional">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                className={`nav-button-professional ${currentPage === item.key ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="analytics-main-professional">
        {renderCurrentPage()}
      </main>

      <footer className="analytics-footer-professional">
        <div className="footer-content-professional">
          <span>Outlaw Analytics Dashboard</span>
          <span>Auto-refresh: Every 30 seconds</span>
          <span>Real-time data from PostgreSQL</span>
          <span>Last data sync: {new Date().toLocaleString()}</span>
        </div>
      </footer>
    </div>
  );
};

export default AnalyticsDashboard;