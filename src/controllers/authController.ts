import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import User, { IUser } from '../models/User';

// Ensure environment variables are loaded
dotenv.config();

// Use a function to get JWT_SECRET to ensure it's evaluated at runtime
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables');
    // Instead of exiting, use a fallback for development (not recommended for production)
    return 'bdpqw0lbgcP7ecIlQcPuDfZ5yCmFCAUFjr20zkEAyIE=';
  }
  return secret;
};

// Function to generate a JWT
const generateToken = (id: string | Types.ObjectId) => {
  const idString = id.toString();
  return jwt.sign({ id: idString }, getJwtSecret(), {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }

    const user: IUser = await User.create({
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    // Don't expose internal error details to client
    res.status(500).json({ message: 'An error occurred during registration. Please try again later.' });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordMatch = await user.comparePassword(password);
    
    if (isPasswordMatch) {
      res.status(200).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // Don't specify which credential is wrong for security
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    // Don't expose internal error details to client
    res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
  }
};
