import mongoose, { Document, Schema } from 'mongoose';

export interface IWaitlist extends Document {
  name: string;
  email: string;
}

const WaitlistSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Waitlist = mongoose.model<IWaitlist>('Waitlist', WaitlistSchema);
export default Waitlist;