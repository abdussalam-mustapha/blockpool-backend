import { Request, Response } from 'express';
import Waitlist from '../models/Waitlist';

/**
 * @desc    Add user to waitlist
 * @route   POST /api/waitlist
 * @access  Public
 */
export const addToWaitlist = async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ message: 'Please provide name and email' });
    return;
  }

  try {
    const newEntry = new Waitlist({ name, email });
    await newEntry.save();
    res.status(201).json({ message: 'Successfully added to waitlist' });
  } catch (error) {
    // Check for duplicate key error (email)
    if ((error as any).code === 11000) {
        res.status(409).json({ message: 'This email is already on the waitlist.' });
        return;
    }
    res.status(500).json({ message: 'Error adding to waitlist', error });
  }
};
