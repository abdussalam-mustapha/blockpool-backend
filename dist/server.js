"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const waitlistRoutes_1 = __importDefault(require("./routes/waitlistRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/waitlist', waitlistRoutes_1.default);
// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blockpool';
// Log the MongoDB connection string (without credentials) for debugging
const sanitizedUri = MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log(`Attempting to connect to MongoDB at: ${sanitizedUri}`);
// Set mongoose connection options
const mongooseOptions = {
    useNewUrlParser: true, // Deprecated in newer versions but added for compatibility
    useUnifiedTopology: true, // Deprecated in newer versions but added for compatibility
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    ssl: true, // Enable SSL for MongoDB Atlas
    tls: true, // Enable TLS
    tlsAllowInvalidCertificates: false, // Don't allow invalid certificates
    tlsAllowInvalidHostnames: false, // Don't allow invalid hostnames
    retryWrites: true,
    maxPoolSize: 10 // Maintain up to 10 socket connections
};
mongoose_1.default.connect(MONGO_URI, mongooseOptions)
    .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
    // Provide more helpful error messages based on common issues
    if (err.name === 'MongooseServerSelectionError') {
        console.error('\nServer selection error - this could be due to:');
        console.error('1. Network connectivity issues');
        console.error('2. MongoDB Atlas IP whitelist restrictions');
        console.error('3. Incorrect username/password');
        console.error('4. TLS/SSL certificate issues');
        // Check if it's a TLS error
        if (err.message.includes('SSL') || err.message.includes('TLS')) {
            console.error('\nTLS/SSL Error detected. Try these solutions:');
            console.error('1. Update Node.js to the latest version');
            console.error('2. Try using a direct connection string without TLS options');
            console.error('3. Check if your network allows secure connections to MongoDB Atlas');
        }
    }
    // Don't exit the process, allow for retry or fallback
    console.error('\nApplication will continue, but database functionality will be limited.');
});
