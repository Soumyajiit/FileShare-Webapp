const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  mimetype: String,
  size: Number
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  files: [fileSchema]
});

// 🔥 Add TTL index manually
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model('Session', sessionSchema);
