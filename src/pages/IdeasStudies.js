import React, { useState } from 'react';

const IdeasStudies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Sample hardcoded ideas matching your PostgreSQL schema
  const ideas = [
    {
      id: 1,
      user_id: 101,
      name: 'Smart Waste Sorting Assistant',
      description: 'AI-powered waste sorting system for households and businesses.',
      targeted_audience: 'Urban Families, Municipal Corporations',
      stage: 'In Progress',
      created_at: '2025-06-01T10:00:00Z',
      updated_at: '2025-07-20T14:00:00Z',
      pitch_deck: 'https://example.com/deck1.pdf',
      voice_note: '',
      ai_request_id: 'REQ1234',
      idea_capture: 'CAPTURE456',
      lens_selector: 'ENVIRONMENT',
      survey_generator: 'SURVEY789',
      document: '',
      lenses: {
        sme: { status: 'Completed', progress: 100, feedback: 'Great eco-tech initiative', rating: 4.7, reviewer: 'Dr. Green', completedDate: '2025-07-15' },
        survey: { status: 'Completed', progress: 100, responses: 120, avgScore: 4.5, completedDate: '2025-07-17' },
        social: { status: 'In Progress', progress: 60, mentions: 80, sentiment: 'Positive', engagementRate: '3.9%' },
        peer: { status: 'In Progress', progress: 50, reviews: 6, avgRating: 4.3, pendingReviews: 2 }
      }
    },
    {
      id: 2,
      user_id: 102,
      name: 'Virtual Farming Advisor',
      description: 'Voice-based farming assistant for remote villages with regional language support.',
      targeted_audience: 'Rural Farmers',
      stage: 'Starting',
      created_at: '2025-07-10T08:30:00Z',
      updated_at: '2025-07-20T09:00:00Z',
      pitch_deck: '',
      voice_note: '',
      ai_request_id: null,
      idea_capture: null,
      lens_selector: 'AGRI',
      survey_generator: null,
      document: null,
      lenses: {
        sme: { status: 'Pending', progress: 0, feedback: '', rating: 0, reviewer: '' },
        survey: { status: 'Pending', progress: 0, responses: 0, avgScore: 0 },
        social: { status: 'Pending', progress: 0, mentions: 0, sentiment: 'N/A', engagementRate: '0%' },
        peer: { status: 'Pending', progress: 0, reviews: 0, avgRating: 0, pendingReviews: 0 }
      }
    },
    {
      id: 3,
      user_id: 103,
      name: 'Mental Health Companion App',
      description: 'App for youth to track emotional wellness and get AI-based support.',
      targeted_audience: 'Students, Working Professionals',
      stage: 'Completed',
      created_at: '2025-05-20T12:00:00Z',
      updated_at: '2025-07-15T13:30:00Z',
      pitch_deck: 'https://example.com/mental-health-app-deck.pdf',
      voice_note: '',
      ai_request_id: 'REQ9999',
      idea_capture: 'CAPTURE321',
      lens_selector: 'HEALTH',
      survey_generator: 'SURVEY456',
      document: 'https://example.com/report.pdf',
      lenses: {
        sme: { status: 'Completed', progress: 100, feedback: 'Strong mental health framework', rating: 4.8, reviewer: 'Dr. Emma Stone', completedDate: '2025-07-12' },
        survey: { status: 'Completed', progress: 100, responses: 150, avgScore: 4.7, completedDate: '2025-07-16' },
        social: { status: 'Completed', progress: 100, mentions: 240, sentiment: 'Very Positive', engagementRate: '6.2%' },
        peer: { status: 'Completed', progress: 100, reviews: 10, avgRating: 4.6, pendingReviews: 0 }
      }
    }
  ];

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idea.targeted_audience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || idea.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const getStatusBadge = (status) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    };

    switch (status) {
      case 'Completed':
        return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
      case 'In Progress':
        return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
      case 'Starting':
        return { ...baseStyle, backgroundColor: '#d1ecf1', color: '#0c5460' };
      case 'Pending':
        return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
      default:
        return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  const getLensStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return '✅';
      case 'In Progress': return '🔄';
      case 'Pending': return '⏳';
      default: return '❓';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (selectedIdea) {
    // You can reuse the previous code’s detailed view component here
    return (
      <div style={{ padding: '20px' }}>
        <h2>{selectedIdea.name}</h2>
        <p>{selectedIdea.description}</p>
        <p><strong>Target Audience:</strong> {selectedIdea.targeted_audience}</p>
        <p><strong>Stage:</strong> {selectedIdea.stage}</p>
        <p><strong>Created At:</strong> {formatDate(selectedIdea.created_at)}</p>
        <p><strong>Updated At:</strong> {formatDate(selectedIdea.updated_at)}</p>
        <button onClick={() => setSelectedIdea(null)}>← Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ideas Overview</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', flex: 1, border: '1px solid #ced4da', borderRadius: '4px' }}
        />
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
        >
          <option value="all">All Stages</option>
          <option value="Starting">Starting</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredIdeas.map(idea => (
          <div
            key={idea.id}
            onClick={() => setSelectedIdea(idea)}
            style={{
              border: '1px solid #e3e6f0',
              borderRadius: '8px',
              backgroundColor: 'white',
              padding: '16px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{idea.name}</h3>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>{idea.description.substring(0, 100)}...</p>
            <div style={{ marginTop: '10px' }}>
              <span style={getStatusBadge(idea.stage)}>{idea.stage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeasStudies;
