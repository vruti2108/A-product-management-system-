const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  return validations;
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    console.log('📝 Signup request:', req.body);

    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      
      return res.status(400).json({ 
        success: false, 
        message: `Please fill in all required fields: ${missingFields.join(', ')}` 
      });
    }

    // Trim whitespace
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Validate name
    if (trimmedName.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name cannot be empty' 
      });
    }

    if (trimmedName.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name must be at least 2 characters long' 
      });
    }

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address with @ and domain (e.g., user@example.com)' 
      });
    }

    // Check if email contains @
    if (!trimmedEmail.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email must contain @ symbol' 
      });
    }

    // Check if email has proper domain
    const emailParts = trimmedEmail.split('@');
    if (emailParts.length !== 2 || !emailParts[1].includes('.')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email must have a valid domain (e.g., .com, .org, .net)' 
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);

    if (!passwordValidation.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    if (!passwordValidation.uppercase) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must contain at least one uppercase letter (A-Z)' 
      });
    }

    if (!passwordValidation.lowercase) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must contain at least one lowercase letter (a-z)' 
      });
    }

    if (!passwordValidation.digit) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must contain at least one digit (0-9)' 
      });
    }

    if (!passwordValidation.specialChar) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must contain at least one special character (!@#$%^&*...)' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: trimmedEmail.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists:', trimmedEmail);
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists. Please login or use a different email.' 
      });
    }

    // Create user
    console.log('Creating new user...');
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail.toLowerCase(),
      password
    });

    console.log('✅ User created successfully');

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during signup: ' + error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('🔐 Login request:', req.body.email);

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      
      return res.status(400).json({ 
        success: false, 
        message: `Please provide ${missingFields.join(' and ')}` 
      });
    }

    // Trim whitespace
    const trimmedEmail = email.trim();

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: trimmedEmail.toLowerCase() }).select('+password');
    if (!user) {
      console.log('❌ User not found:', trimmedEmail);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      console.log('❌ Invalid password for:', trimmedEmail);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Login successful:', trimmedEmail);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login: ' + error.message 
    });
  }
};