import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false
  });

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Validate email
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Email must contain @ symbol';
    
    const emailParts = email.split('@');
    if (emailParts.length !== 2) return 'Invalid email format';
    
    const domain = emailParts[1];
    if (!domain.includes('.')) return 'Email must have a valid domain (e.g., .com, .org)';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    return null;
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    const strength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      // eslint-disable-next-line no-useless-escape
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordStrength(strength);
    return strength;
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    
    const strength = checkPasswordStrength(password);
    
    if (!strength.length) {
      return 'Password must be at least 8 characters long';
    }
    if (!strength.uppercase) {
      return 'Password must contain at least one uppercase letter (A-Z)';
    }
    if (!strength.lowercase) {
      return 'Password must contain at least one lowercase letter (a-z)';
    }
    if (!strength.digit) {
      return 'Password must contain at least one digit (0-9)';
    }
    if (!strength.specialChar) {
      return 'Password must contain at least one special character (!@#$%^&*...)';
    }
    
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields are filled
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      const missingFields = [];
      if (!formData.name) missingFields.push('Name');
      if (!formData.email) missingFields.push('Email');
      if (!formData.password) missingFields.push('Password');
      if (!formData.confirmPassword) missingFields.push('Confirm Password');
      
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate name
    const trimmedName = formData.name.trim();
    if (trimmedName.length === 0) {
      setError('Name cannot be empty');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name: trimmedName,
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (result.success) {
        navigate('/products');
      } else {
        setError(result.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to start managing your products</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              disabled={loading}
              autoComplete="email"
            />
            <small className="input-hint">Must include @ and valid domain (.com, .org, etc.)</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              disabled={loading}
              autoComplete="new-password"
            />
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-requirements">
                <p className="requirements-title">Password must contain:</p>
                <ul className="requirements-list">
                  <li className={passwordStrength.length ? 'valid' : 'invalid'}>
                    {passwordStrength.length ? '✓' : '✗'} At least 8 characters
                  </li>
                  <li className={passwordStrength.uppercase ? 'valid' : 'invalid'}>
                    {passwordStrength.uppercase ? '✓' : '✗'} One uppercase letter (A-Z)
                  </li>
                  <li className={passwordStrength.lowercase ? 'valid' : 'invalid'}>
                    {passwordStrength.lowercase ? '✓' : '✗'} One lowercase letter (a-z)
                  </li>
                  <li className={passwordStrength.digit ? 'valid' : 'invalid'}>
                    {passwordStrength.digit ? '✓' : '✗'} One digit (0-9)
                  </li>
                  <li className={passwordStrength.specialChar ? 'valid' : 'invalid'}>
                    {passwordStrength.specialChar ? '✓' : '✗'} One special character (!@#$%...)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
