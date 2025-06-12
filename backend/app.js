// Load environment variables from the .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// --- Route Imports ---
const authRoutes = require('./src/routes/authRoutes');

// --- Initialize Express App ---
const app = express();

// --- Database Connection ---
connectDB();

// --- Core Middlewares ---
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// --- API Route Mounting ---
// All routes defined in authRoutes will be prefixed with '/api/auth'
app.use('/api/auth', authRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in '${process.env.NODE_ENV || 'development'}' mode on port ${PORT}`);
});
