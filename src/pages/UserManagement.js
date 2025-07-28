import React, { useState } from 'react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Hardcoded user data matching DB schema
  const [users, setUsers] = useState([
    {
      id: 1,
      email: "sarah.chen@example.com",
      password: null,
      temp_id: "temp-1",
      auth_type: "email",
      persona_type: "Founder",
      created_at: "2024-12-15T10:00:00Z",
      updated_at: "2025-01-27T10:00:00Z",
      deleted_at: null,
      email_verified_at: "2024-12-15T10:05:00Z"
    },
    {
      id: 2,
      email: "m.rodriguez@university.edu",
      password: null,
      temp_id: "temp-2",
      auth_type: "google",
      persona_type: "SME",
      created_at: "2024-11-20T09:00:00Z",
      updated_at: "2025-01-28T09:00:00Z",
      deleted_at: null,
      email_verified_at: "2024-11-20T09:10:00Z"
    },
    {
      id: 3,
      email: "jessica.park@gmail.com",
      password: null,
      temp_id: "temp-3",
      auth_type: "email",
      persona_type: "Respondent",
      created_at: "2025-01-10T08:00:00Z",
      updated_at: "2025-01-27T08:00:00Z",
      deleted_at: null,
      email_verified_at: "2025-01-10T08:05:00Z"
    }, 
    {
      id: 4,
      email: "david.kim@techcorp.com",
      password: null,
      temp_id: "temp-4",
      auth_type: "email",
      persona_type: "Founder",
      created_at: "2024-10-05T07:00:00Z",
      updated_at: "2025-01-15T07:00:00Z",
      deleted_at: null,
      email_verified_at: null
    },
    {
      id: 5,
      email: "a.foster@research.org",
      password: null,
      temp_id: "temp-5",
      auth_type: "google",
      persona_type: "SME",
      created_at: "2024-12-01T06:00:00Z",
      updated_at: "2025-01-28T06:00:00Z",
      deleted_at: null,
      email_verified_at: "2024-12-01T06:10:00Z"
    },
    {
      id: 6,
      email: "mark.t@consumer.net",
      password: null,
      temp_id: "temp-6",
      auth_type: "email",
      persona_type: "Respondent",
      created_at: "2025-01-05T05:00:00Z",
      updated_at: "2025-01-26T05:00:00Z",
      deleted_at: null,
      email_verified_at: "2025-01-05T05:05:00Z"
    }
  ]);

  // Hardcoded user_information data
  const [userInformation, setUserInformation] = useState([
    {
      id: 1,
      user_id: 1,
      name: "Sarah Chen",
      linkedin: "linkedin.com/in/sarahchen",
      github: "github.com/sarahchen",
      industry: "Fintech",
      country: "USA",
      experience: "10+ years in fintech, building next-gen payment solutions.",
      avatar: "SC",
      created_at: "2024-12-15T10:00:00Z",
      updated_at: "2025-01-27T10:00:00Z",
      profile_title: "Founder & CEO",
      available_time_slots: [],
      cv_url: null,
      age: 36,
      description: "Serial entrepreneur with 10+ years in fintech. Currently building next-gen payment solutions."
    },
    {
      id: 2,
      user_id: 2,
      name: "Dr. Michael Rodriguez",
      linkedin: "linkedin.com/in/mrodriguez",
      github: "github.com/mrodriguez",
      industry: "Academia",
      country: "USA",
      experience: "Professor of Computer Science at MIT. Expert in machine learning and AI ethics.",
      avatar: "MR",
      created_at: "2024-11-20T09:00:00Z",
      updated_at: "2025-01-28T09:00:00Z",
      profile_title: "Professor, MIT",
      available_time_slots: [],
      cv_url: null,
      age: 48,
      description: "Professor of Computer Science at MIT. Expert in machine learning and AI ethics."
    },
    {
      id: 3,
      user_id: 3,
      name: "Jessica Park",
      linkedin: "linkedin.com/in/jessicapark",
      github: "github.com/jessicapark",
      industry: "UX Research",
      country: "USA",
      experience: "UX researcher with passion for understanding consumer behavior and product usability.",
      avatar: "JP",
      created_at: "2025-01-10T08:00:00Z",
      updated_at: "2025-01-27T08:00:00Z",
      profile_title: "UX Researcher",
      available_time_slots: [],
      cv_url: null,
      age: 29,
      description: "UX researcher with passion for understanding consumer behavior and product usability."
    },
    {
      id: 4,
      user_id: 4,
      name: "David Kim",
      linkedin: "linkedin.com/in/davidkim",
      github: "github.com/davidkim",
      industry: "Healthcare Tech",
      country: "USA",
      experience: "Healthcare technology entrepreneur focused on mobile health solutions.",
      avatar: "DK",
      created_at: "2024-10-05T07:00:00Z",
      updated_at: "2025-01-15T07:00:00Z",
      profile_title: "Founder",
      available_time_slots: [],
      cv_url: null,
      age: 41,
      description: "Healthcare technology entrepreneur focused on mobile health solutions."
    },
    {
      id: 5,
      user_id: 5,
      name: "Dr. Amanda Foster",
      linkedin: "linkedin.com/in/amandafoster",
      github: "github.com/amandafoster",
      industry: "Biotech",
      country: "USA",
      experience: "Biotech industry veteran with 15+ years in drug development and regulatory affairs.",
      avatar: "AF",
      created_at: "2024-12-01T06:00:00Z",
      updated_at: "2025-01-28T06:00:00Z",
      profile_title: "Senior Researcher",
      available_time_slots: [],
      cv_url: null,
      age: 44,
      description: "Biotech industry veteran with 15+ years in drug development and regulatory affairs."
    },
    {
      id: 6,
      user_id: 6,
      name: "Mark Thompson",
      linkedin: "linkedin.com/in/markthompson",
      github: "github.com/markthompson",
      industry: "Consumer Electronics",
      country: "USA",
      experience: "Tech enthusiast and early adopter. Enjoys testing new products and providing feedback.",
      avatar: "MT",
      created_at: "2025-01-05T05:00:00Z",
      updated_at: "2025-01-26T05:00:00Z",
      profile_title: "Product Tester",
      available_time_slots: [],
      cv_url: null,
      age: 32,
      description: "Tech enthusiast and early adopter. Enjoys testing new products and providing feedback."
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Respondent',
    location: '',
    expertise: '',
    bio: ''
  });

  // Join users and userInformation for display
  const joinedUsers = users.map(user => {
    const info = userInformation.find(ui => ui.user_id === user.id) || {};
    return {
      ...user,
      ...info,
      role: user.persona_type,
      status: user.deleted_at ? 'Inactive' : 'Active',
      joinDate: user.created_at ? user.created_at.split('T')[0] : '',
      lastActive: user.updated_at ? user.updated_at.split('T')[0] : '',
      profilePicture: info.avatar || '',
      location: info.country || '',
      expertise: info.industry ? [info.industry] : [],
      bio: info.description || '',
      // Demo fields for metrics
      studiesCreated: user.id === 1 ? 12 : user.id === 4 ? 3 : 0,
      studiesReviewed: user.id === 2 ? 28 : user.id === 5 ? 19 : 0,
      surveysCompleted: user.id === 3 ? 15 : user.id === 6 ? 8 : 0,
      engagement: [94, 87, 72, 45, 91, 68][user.id - 1] || 0
    };
  });

  const filteredUsers = joinedUsers.filter(user => {
    const matchesSearch = user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    };
    
    switch (role) {
      case 'Founder':
        return { ...baseStyle, backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'SME':
        return { ...baseStyle, backgroundColor: '#f3e5f5', color: '#7b1fa2' };
      case 'Respondent':
        return { ...baseStyle, backgroundColor: '#e8f5e8', color: '#388e3c' };
      default:
        return { ...baseStyle, backgroundColor: '#f5f5f5', color: '#616161' };
    }
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    };
    
    if (status === 'Active') {
      return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
    } else {
      return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
    }
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        ...newUser,
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        profilePicture: newUser.name.split(' ').map(n => n[0]).join(''),
        studiesCreated: 0,
        studiesReviewed: 0,
        surveysCompleted: 0,
        engagement: 0,
        expertise: newUser.expertise.split(',').map(e => e.trim())
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'Respondent', location: '', expertise: '', bio: '' });
      setShowAddUser(false);
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUser(null);
    }
  };

  // User detail view
  if (selectedUser) {
    return (
      <div style={{ padding: '20px', height: '100%' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setSelectedUser(null)}
            style={{
              background: 'none',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              color: '#495057'
            }}
          >
            ← Back to Users
          </button>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#495057', margin: 0 }}>
              {selectedUser.name}
            </h1>
            <p style={{ color: '#6c757d', fontSize: '14px', margin: '5px 0 0 0' }}>
              {selectedUser.role} • {selectedUser.location}
            </p>
          </div>
        </div>

        {/* User Info Panel */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e3e6f0',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#667eea',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {selectedUser.profilePicture}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <span style={getRoleBadge(selectedUser.role)}>{selectedUser.role}</span>
                <span style={getStatusBadge(selectedUser.status)}>{selectedUser.status}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>EMAIL</div>
                  <div style={{ fontWeight: '500' }}>{selectedUser.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>JOINED</div>
                  <div style={{ fontWeight: '500' }}>{selectedUser.joinDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>LAST ACTIVE</div>
                  <div style={{ fontWeight: '500' }}>{selectedUser.lastActive}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>ENGAGEMENT</div>
                  <div style={{ fontWeight: '500', color: selectedUser.engagement >= 80 ? '#28a745' : selectedUser.engagement >= 60 ? '#ffc107' : '#dc3545' }}>
                    {selectedUser.engagement}%
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>BIO</div>
                <div style={{ color: '#495057', lineHeight: 1.4 }}>{selectedUser.bio}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>EXPERTISE</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedUser.expertise.map((skill, index) => (
                    <span key={index} style={{
                      backgroundColor: '#f8f9fa',
                      color: '#495057',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: '1px solid #e9ecef'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleUserStatus(selectedUser.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedUser.status === 'Active' ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {selectedUser.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => deleteUser(selectedUser.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>

        {/* Activity Metrics */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e3e6f0',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#495057' }}>Activity Metrics</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {selectedUser.role === 'Founder' && (
              <>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                    {selectedUser.studiesCreated}
                  </div>
                  <div style={{ color: '#6c757d' }}>Studies Created</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', marginBottom: '10px' }}>
                    8
                  </div>
                  <div style={{ color: '#6c757d' }}>Completed Studies</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107', marginBottom: '10px' }}>
                    4
                  </div>
                  <div style={{ color: '#6c757d' }}>In Progress</div>
                </div>
              </>
            )}
            
            {selectedUser.role === 'SME' && (
              <>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7b1fa2', marginBottom: '10px' }}>
                    {selectedUser.studiesReviewed}
                  </div>
                  <div style={{ color: '#6c757d' }}>Studies Reviewed</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', marginBottom: '10px' }}>
                    4.6
                  </div>
                  <div style={{ color: '#6c757d' }}>Avg Rating</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                    12h
                  </div>
                  <div style={{ color: '#6c757d' }}>Avg Response Time</div>
                </div>
              </>
            )}
            
            {selectedUser.role === 'Respondent' && (
              <>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#388e3c', marginBottom: '10px' }}>
                    {selectedUser.surveysCompleted}
                  </div>
                  <div style={{ color: '#6c757d' }}>Surveys Completed</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800', marginBottom: '10px' }}>
                    3
                  </div>
                  <div style={{ color: '#6c757d' }}>Studies Participated</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e63', marginBottom: '10px' }}>
                    95%
                  </div>
                  <div style={{ color: '#6c757d' }}>Completion Rate</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Add User Modal
  if (showAddUser) {
    return (
      <div style={{ padding: '20px', height: '100%' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setShowAddUser(false)}
            style={{
              background: 'none',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              color: '#495057'
            }}
          >
            ← Back to Users
          </button>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#495057', margin: 0 }}>
              Add New User
            </h1>
            <p style={{ color: '#6c757d', fontSize: '14px', margin: '5px 0 0 0' }}>
              Create a new user account
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e3e6f0',
          padding: '30px',
          maxWidth: '600px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#495057' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#495057' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#495057' }}>
                Role *
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="Respondent">Respondent</option>
                <option value="Founder">Founder</option>
                <option value="SME">SME</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#495057' }}>
                Location
              </label>
              <input
                type="text"
                value={newUser.location}
                onChange={(e) => setNewUser({...newUser, location: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#495057' }}>
                Expertise (comma-separated)
              </label>
              <input
                type="text"
                value={newUser.expertise}
                onChange={(e) => setNewUser({...newUser, expertise: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="e.g., Machine Learning, Data Science, AI"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#495057' }}>
                Bio
              </label>
              <textarea
                value={newUser.bio}
                onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Brief description about the user"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                onClick={() => setShowAddUser(false)}
                style={{
                  padding: '12px 20px',
                  border: '1px solid #ced4da',
                  backgroundColor: 'white',
                  color: '#495057',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main user list view
  return (
    <div style={{ padding: '20px', height: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
          👥 User Management
        </h1>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          Primary focus - Manage all user accounts, permissions, and access controls
        </p>
      </div>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e3e6f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '5px' }}>
            {users.length}
          </div>
          <div style={{ color: '#6c757d', fontSize: '14px' }}>Total Users</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e3e6f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', marginBottom: '5px' }}>
            {users.filter(u => u.status === 'Active').length}
          </div>
          <div style={{ color: '#6c757d', fontSize: '14px' }}>Active Users</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e3e6f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2', marginBottom: '5px' }}>
            {users.filter(u => u.role === 'Founder').length}
          </div>
          <div style={{ color: '#6c757d', fontSize: '14px' }}>Founders</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e3e6f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2', marginBottom: '5px' }}>
            {users.filter(u => u.role === 'SME').length}
          </div>
          <div style={{ color: '#6c757d', fontSize: '14px' }}>SME Experts</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '12px 16px',
            border: '1px solid #ced4da',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #ced4da',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          <option value="all">All Roles</option>
          <option value="Founder">Founders</option>
          <option value="SME">SME Experts</option>
          <option value="Respondent">Respondents</option>
        </select>
        
        <button
          onClick={() => setShowAddUser(true)}
          style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          + Add User
        </button>
      </div>

      {/* User List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e3e6f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e3e6f0',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px 8px 0 0'
        }}>
          <h3 style={{ margin: 0, color: '#495057' }}>All Users ({filteredUsers.length})</h3>
        </div>
        
        <div style={{ padding: '20px' }}>
          {filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
              No users found matching your criteria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filteredUsers.map((user) => (
                <div key={user.id} style={{
                  padding: '20px',
                  border: '1px solid #e3e6f0',
                  borderRadius: '8px',
                  transition: 'box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      {user.profilePicture}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <h4 style={{ margin: 0, color: '#495057', fontSize: '16px' }}>
                          {user.name}
                        </h4>
                        <span style={getRoleBadge(user.role)}>{user.role}</span>
                        <span style={getStatusBadge(user.status)}>{user.status}</span>
                      </div>
                      
                      <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '8px' }}>
                        {user.email} • {user.location}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#6c757d' }}>
                        <span>Joined: {user.joinDate}</span>
                        <span>Last Active: {user.lastActive}</span>
                        <span>Engagement: <strong style={{ color: user.engagement >= 80 ? '#28a745' : user.engagement >= 60 ? '#ffc107' : '#dc3545' }}>{user.engagement}%</strong></span>
                        {user.role === 'Founder' && <span>Studies: <strong>{user.studiesCreated}</strong></span>}
                        {user.role === 'SME' && <span>Reviews: <strong>{user.studiesReviewed}</strong></span>}
                        {user.role === 'Respondent' && <span>Surveys: <strong>{user.surveysCompleted}</strong></span>}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View Details
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserStatus(user.id);
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: user.status === 'Active' ? '#ffc107' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
