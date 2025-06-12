const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address.'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 6,
        select: false // Exclude password from query results by default
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Mongoose middleware to hash the password before saving a document
userSchema.pre('save', async function (next) {
    // Only run this function if the password was actually modified
    if (!this.isModified('password')) {
        return next();
    }
    // Generate a salt and hash the password with it
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
