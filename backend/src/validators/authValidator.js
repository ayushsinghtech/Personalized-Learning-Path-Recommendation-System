const { body, validationResult } = require('express-validator');

/**
 * An array of validation rules for user registration.
 */
const registerValidationRules = () => [
    body('name', 'Name is required.').not().isEmpty(),
    body('email', 'Please provide a valid email.').isEmail(),
    body('password', 'Password must be at least 6 characters long.').isLength({ min: 6 }),
];

/**
 * An array of validation rules for user login.
 */
const loginValidationRules = () => [
    body('email', 'Please provide a valid email.').isEmail(),
    body('password', 'Password is required.').not().isEmpty(),
];

/**
 * An array of validation rules for changing the password.
 */
const changePasswordValidationRules = () => [
    body('oldPassword', 'Old password is required.').not().isEmpty(),
    body('newPassword', 'New password must be at least 6 characters long.').isLength({ min: 6 }),
];

/**
 * A middleware that checks for and responds with validation errors.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));
    return res.status(422).json({ errors: extractedErrors });
};

module.exports = {
    registerValidationRules,
    loginValidationRules,
    changePasswordValidationRules,
    validate,
};
