import mongoose from 'mongoose';

const imagePairSchema = new mongoose.Schema({
  originalImage: {
    type: String,
    required: true
  },
  maskImage: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ImagePair', imagePairSchema);