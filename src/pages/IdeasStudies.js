import React from 'react';

const IdeasStudies = () => {
  return (
    <div style={{ padding: '20px', height: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
          💡 Ideas & Studies
        </h1>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          View all creator ideas and study progress
        </p>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e3e6f0',
        minHeight: '500px',
        padding: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          color: '#6c757d'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>💡</div>
          <h3 style={{ marginBottom: '10px', color: '#495057' }}>Ideas & Studies Center</h3>
          <p style={{ textAlign: 'center', lineHeight: 1.6 }}>
            This is your Ideas & Studies workspace.<br/>
            Add idea tracking, study progress charts, creator submissions, and research tools.
          </p>
          <div style={{
            marginTop: '30px',
            padding: '15px 25px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '2px dashed #dee2e6'
          }}>
            <strong>Ready for your content!</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeasStudies;