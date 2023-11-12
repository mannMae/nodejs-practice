import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 20,
  },
  description: { type: String, required: true, trim: true, maxLength: 140 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, defualt: 0 },
    rating: { type: Number, defualt: 0 },
  },
});

videoSchema.static('formatHashtags', (hashtags) =>
  hashtags.split(',').map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
);

export const videoModel = mongoose.model('Video', videoSchema);
