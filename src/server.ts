import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Waitlist from './models/Waitlist';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || '', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // dbName: 'blockpool',
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/waitlist', async (req, res) => {
  const { name, email } = req.body;

  try {
    const newEntry = new Waitlist({ name, email });
    await newEntry.save();
    res.status(201).json({ message: 'Successfully added to waitlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to waitlist', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});