import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, requried: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

export const userModel = mongoose.model('User', userSchema);
