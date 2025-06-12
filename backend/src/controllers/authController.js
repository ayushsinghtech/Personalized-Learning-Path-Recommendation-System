const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Generates a JSON Web Token for a given user ID.
 * @param {string} id - The user's MongoDB document ID.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in one day
    });
};

/**
 * Registers a new user, hashes their password, and returns a JWT.
 */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        user = new User({ name, email, password });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

/**
 * Authenticates an existing user and returns a JWT.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

/**
 * Retrieves the profile of the currently authenticated user.
 */
const getMyProfile = async (req, res) => {
    try {
        // req.user is attached by the 'protect' middleware
        res.status(200).json(req.user);
    } catch (error) {
        console.error('Get Profile Error:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};

/**
 * Changes the password for the currently authenticated user.
 */
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ message: 'Incorrect old password.' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change Password Error:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMyProfile,
    changePassword,
};
