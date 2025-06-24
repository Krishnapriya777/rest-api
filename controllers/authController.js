const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const multer=require("multer");
const sendEmail = require("../utils/sendEmail");
const JWT_SECRET = 'kpkp';
const REFRESH_TOKEN_SECRET = 'refresh-secret';

let refreshTokens = []; 
const storage=multer.diskStorage(
  {
    destination:(req,file,cb)=>
    {
      cb(null,'uploads/');
    },
    filename:(req,file,cb)=>
    {
      const ext=path.extname(file.orginalname);
      cb(null,Date.now()+ext);

    },
    
  }
);
const upload=multer({storage});
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profilepicpath=req.file?req.file.path:null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isverified: false,
      profilepic:profilepicpath,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    const link = `http://localhost:5000/api/auth/verify-email?token=${token}`;
    const html = `<h2>Hello, ${name}!</h2><p>Please verify your email by clicking this link:</p><a href="${link}">${link}</a>`;

    try {
      await sendEmail(email, 'Verify your email', html);
    } catch (emailError) {
      await User.findByIdAndDelete(newUser._id);
      return res.status(400).json({ message: 'Invalid email address. Registration failed.' });
    }

    res.status(201).json({
      message: 'User registered. Please check your email to verify your account.',
    });
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
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: 'User not found' });

  const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10m' });

  const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
  const html = `
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password. This link is valid for 10 minutes.</p>
    <a href="${resetLink}">${resetLink}</a>
  `;

  await sendEmail(email, 'Reset Your Password', html);

  res.json({ message: 'Password reset link sent to email' });
};
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await User.findByIdAndUpdate(decoded.id, { isverified: true });
    res.send("Email verified successfully!");
  } catch (err) {
    res.status(400).send("Invalid or expired token.");
  }
};