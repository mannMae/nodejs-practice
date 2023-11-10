import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: String,
  dscription: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

export const videoMoel = mongoose.model('Video', videoSchema);
