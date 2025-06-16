const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const JWT_SECRET = 'kpkp';
const REFRESH_TOKEN_SECRET = 'refresh-secret';

let refreshTokens = []; 
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    
    const html = `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for registering.</p>
    `;
    await sendEmail(email, 'Welcome to Our App!', html);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign({ id: user._id },JWT_SECRET, {
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    });

    refreshTokens.push(refreshToken);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token)
    return res.status(401).json({ message: 'Refresh token required' });

  if (!refreshTokens.includes(token))
    return res.status(403).json({ message: 'Invalid refresh token' });

  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ id: payload.id }, JWT_SECRET, {
      expiresIn: '15m'
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};


exports.logout = (req, res) => {
  const { token } = req.body;

  if (!token)
    return res.status(400).json({ message: 'Token required' });

  refreshTokens = refreshTokens.filter(t => t !== token);
  res.json({ message: 'Logged out successfully' });
};
