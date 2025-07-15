"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
// Ensure environment variables are loaded
dotenv_1.default.config();
// Use a function to get JWT_SECRET to ensure it's evaluated at runtime
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not defined in environment variables');
        // Instead of exiting, use a fallback for development (not recommended for production)
        return 'bdpqw0lbgcP7ecIlQcPuDfZ5yCmFCAUFjr20zkEAyIE=';
    }
    return secret;
};
// Function to generate a JWT
const generateToken = (id) => {
    const idString = id.toString();
    return jsonwebtoken_1.default.sign({ id: idString }, getJwtSecret(), {
        expiresIn: '30d',
    });
};
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(409).json({ message: 'User with this email already exists' });
            return;
        }
        const user = yield User_1.default.create({
            email,
            password,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        // Don't expose internal error details to client
        res.status(500).json({ message: 'An error occurred during registration. Please try again later.' });
    }
});
exports.registerUser = registerUser;
/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const isPasswordMatch = yield user.comparePassword(password);
        if (isPasswordMatch) {
            res.status(200).json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
            });
        }
        else {
            // Don't specify which credential is wrong for security
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        // Don't expose internal error details to client
        res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
    }
});
exports.loginUser = loginUser;
