const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMyProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const {
    registerValidationRules,
    loginValidationRules,
    changePasswordValidationRules,
    validate
} = require('../validators/authValidator');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and return a token.
 * @access  Public
 */
router.post('/register', registerValidationRules(), validate, registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and return a token.
 * @access  Public
 */
router.post('/login', loginValidationRules(), validate, loginUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get the profile of the currently authenticated user.
 * @access  Private
 */
router.get('/me', protect, getMyProfile);

/**
 * @route   PUT /api/auth/changepassword
 * @desc    Change the password for the authenticated user.
 * @access  Private
 */
router.put('/changepassword', protect, changePasswordValidationRules(), validate, changePassword);

// Note: A formal /logout route isn't strictly necessary for stateless JWT,
// as logout is handled by the client deleting the token.

module.exports = router;
