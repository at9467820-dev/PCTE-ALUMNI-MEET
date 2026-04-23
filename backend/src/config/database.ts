import mongoose from 'mongoose';

export async function initDB(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not defined in environment variables');
  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
}

export default mongoose;
