import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // HARDCODED CREDENTIALS - Check against these exact values
      const validCredentials = [
        { email: 'admin@outlaw.com', password: 'admin123', name: 'Admin User', role: 'Administrator' },
        { email: 'user@outlaw.com', password: 'user123', name: 'Regular User', role: 'User' },
        { email: 'test@outlaw.com', password: 'test123', name: 'Test User', role: 'Tester' }
      ];

      // Find matching credentials
      const validUser = validCredentials.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (validUser) {
        // Successful login
        const userData = {
          id: Math.floor(Math.random() * 1000),
          email: validUser.email,
          name: validUser.name,
          role: validUser.role,
          token: `token-${Date.now()}`
        };
        
        // Call parent login handler - NO localStorage
        onLogin(userData);
      } else {
        throw new Error('Invalid email or password. Try: admin@outlaw.com / admin123');
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@outlaw.com',
      password: 'admin123'
    });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">🔷</span>
              <div className="logo-text-container">
                <span className="logo-text">OUTLAW Admin</span>
                <span className="logo-subtitle">Dashboard</span>
              </div>
            </div>
            <p className="login-subtitle">Sign in to access your admin dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-container">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-container">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="demo-section">
              <div className="divider">
                <span>Demo Access</span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="demo-button"
                disabled={loading}
              >
                🚀 Fill Demo Credentials
              </button>
              <div className="demo-info">
                <div style={{ marginBottom: '8px' }}>
                  <strong>Available Accounts:</strong>
                </div>
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <div>👑 <strong>admin@outlaw.com</strong> | admin123</div>
                  <div>👤 user@outlaw.com | user123</div>
                  <div>🧪 test@outlaw.com | test123</div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>© 2025 OUTLAW Admin Dashboard. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#support">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;