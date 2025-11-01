const express = require('express');
const router = express.Router();

console.log('📁 Loading auth routes...');

const { signup, login } = require('../controllers/authController');

router.post('/signup', (req, res, next) => {
  console.log('🔵 Signup route hit!');
  signup(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('🔵 Login route hit!');
  login(req, res, next);
});

console.log('✅ Auth routes configured');

module.exports = router;