const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * A middleware to protect routes by verifying a JWT from the Authorization header.
 * If the token is valid, it attaches the user's data to the request object.
 */
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Find user by ID and attach to request, excluding the password
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token is invalid or expired.' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token was provided.' });
    }
};

module.exports = { protect };
