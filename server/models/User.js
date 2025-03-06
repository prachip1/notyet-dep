// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  clerkUserId: {
    type: String,
    required: true,
    unique: true
  },
  quotaNumber:{
    type:Number,
    default:5
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  conversations: [{
    message: String,
    sender: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);