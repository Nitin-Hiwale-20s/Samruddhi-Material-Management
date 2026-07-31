const Activity = require("../models/Activity");

// GET /api/activities/recent?limit=10
const getRecent = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(limit);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecent };
