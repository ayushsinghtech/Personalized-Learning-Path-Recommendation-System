const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Protects routes by verifying the JWT from the Authorization header.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extracts the token from the "Bearer <token>" string
            token = req.headers.authorization.split(' ')[1];

            // Verifies the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attaches the user's information to the request object, excluding the password
            req.user = await User.findById(decoded.user.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            // Proceeds to the next middleware or route handler
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