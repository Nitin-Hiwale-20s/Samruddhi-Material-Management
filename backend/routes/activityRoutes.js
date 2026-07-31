const express = require("express");
const router = express.Router();
const { getRecent } = require("../controllers/activityController");
const { protect } = require("../middleware/auth");

router.get("/recent", protect, getRecent);

module.exports = router;
