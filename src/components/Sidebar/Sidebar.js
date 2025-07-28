import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    {
      category: 'MANAGEMENT',
      items: [
        {
          id: 'user-management',
          name: 'User Management',
          icon: '👥',
          description: 'primary focus',
          highlighted: true,
          arrow: true
        },
        {
          id: 'ideas-studies',
          name: 'Ideas & Studies',
          icon: '💡',
          description: 'view all creator ideas and study progress',
          arrow: true
        },
        {
          id: 'analytics',
          name: 'Analytics',
          icon: '📊',
          description: 'usage metrics, registration reports',
          arrow: true
        },
        {
          id: 'surveys',
          name: 'Surveys',
          icon: '📋',
          description: 'survey lists, edits, results',
          arrow: true
        },
        {
          id: 'sme-matching',
          name: 'SME Matching',
          icon: '🤝',
          description: 'approval flows, expert management',
          arrow: true
        }
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        {
          id: 'settings',
          name: 'Settings',
          icon: '⚙️',
          description: 'system configuration',
          arrow: true
        }
      ]
    }
  ];

  const handleMenuClick = (itemId) => {
    setActiveSection(itemId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🔷</span>
          <div className="logo-text-container">
            <span className="logo-text">OUTLAW Admin</span>
            <span className="logo-subtitle">Dashboard</span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="menu-category">
            <div className="category-title">{category.category}</div>
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="menu-item-container">
                <div 
                  className={`menu-item ${activeSection === item.id ? 'active' : ''} ${item.highlighted ? 'highlighted' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <div className="menu-item-content">
                    <div className="menu-item-main">
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-text">{item.name}</span>
                    </div>
                    {item.description && (
                      <div className="menu-description">{item.description}</div>
                    )}
                  </div>
                  <div className="menu-item-right">
                    {item.badge && (
                      <span className={`badge ${item.badgeColor || 'blue'}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.arrow && <span className="arrow">❯</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="admin-user">
          <div className="admin-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="admin-info">
            <div className="admin-name">Admin User</div>
            <div className="admin-role">System Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;