const User = require("../models/User");
const logActivity = require("../utils/logActivity");

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password, role, phone });
    logActivity(req.user?.name, "added user", "users", `${req.user?.name || "Admin"} added user ${name}`);
    const { password: _pw, ...safe } = user.toObject();
    res.status(201).json(safe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const body = { ...req.body };
    delete body._id;
    if (!body.password) delete body.password; // don't overwrite with empty
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });

    Object.assign(user, body);
    await user.save();
    const { password: _pw, ...safe } = user.toObject();
    res.json(safe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
