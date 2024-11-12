import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const commentSchema = new mongoose.Schema({
  commentId: {
    type: Number,
    unique: true
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Apply auto-increment to commentId
commentSchema.plugin(AutoIncrement, { inc_field: 'commentId', start_seq: 1 });

export const Comment = mongoose.model('Comment', commentSchema);
