const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../Model/user');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXP = process.env.JWT_EXP || '1h';

function signAccessToken(user) {
  return jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXP });
}

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    res.status(201).json({ message: 'User created', id: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);

    // create refresh token (random) and store hashed version in DB
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    user.refreshTokens.push(hashedRefresh);
    await user.save();

    // set cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ accessToken, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// helper to find a user by raw refresh token (compares against stored hashes)
async function findUserByRefreshToken(token) {
  const users = await User.find({});
  for (const u of users) {
    for (const h of u.refreshTokens || []) {
      // compare the token with stored hash
      // eslint-disable-next-line no-await-in-loop
      const match = await bcrypt.compare(token, h);
      if (match) return { user: u, hash: h };
    }
  }
  return null;
}

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies && req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    const found = await findUserByRefreshToken(token);
    if (!found) return res.status(401).json({ error: 'Invalid refresh token' });

    const { user, hash } = found;

    // rotate: remove old hash and store a new one
    user.refreshTokens = (user.refreshTokens || []).filter(h => h !== hash);
    const newRefresh = crypto.randomBytes(64).toString('hex');
    const newHash = await bcrypt.hash(newRefresh, 10);
    user.refreshTokens.push(newHash);
    await user.save();

    // set cookie with new refresh token
    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies && req.cookies.refreshToken;
    if (!token) {
      res.clearCookie('refreshToken');
      return res.json({ message: 'Logged out' });
    }
    const found = await findUserByRefreshToken(token);
    if (found) {
      const { user, hash } = found;
      user.refreshTokens = (user.refreshTokens || []).filter(h => h !== hash);
      await user.save();
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
