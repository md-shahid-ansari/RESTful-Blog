import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const postSchema = new mongoose.Schema({
  postId: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
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

// Apply auto-increment to postId
postSchema.plugin(AutoIncrement, { inc_field: 'postId', start_seq: 1 });

export const Post = mongoose.model('Post', postSchema);
