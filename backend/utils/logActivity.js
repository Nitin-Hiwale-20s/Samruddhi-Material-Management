const Activity = require("../models/Activity");

async function logActivity(userName, action, moduleName, description) {
  try {
    await Activity.create({
      userName: userName || "System",
      action,
      module: moduleName || "",
      description: description || "",
    });
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
}

module.exports = logActivity;
