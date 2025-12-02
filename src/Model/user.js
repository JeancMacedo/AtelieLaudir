const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  // store hashed refresh tokens to allow revocation
  refreshTokens: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.index(
  { googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $exists: true, $ne: null } } }
);

module.exports = mongoose.model('User', UserSchema);
