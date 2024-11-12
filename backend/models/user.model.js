import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpireAt: Date,
  verificationToken: String,
  verificationExpireAt: Date
}, { timestamps: true });

// Apply auto-increment to userId
userSchema.plugin(AutoIncrement, { inc_field: 'userId', start_seq: 1 });

export const User = mongoose.model('User', userSchema);
