const User = require('../models/user');

// Get all users
exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const searchRegex = new RegExp(search, 'i');
  const isverified = req.query.isverified;
  let filter = {}

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { name: { $regex: searchRegex } },
      { email: { $regex: searchRegex } }
    ];
  }
  if (isverified != undefined) {
    filter.isverified = isverified === 'true';
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter).select('name email isverified').skip(skip).limit(limit);
  console.log(users);



  res.json({
    data: users,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};


// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
