const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    action: { type: String, required: true }, // e.g. "logged in", "added", "updated", "deleted"
    module: { type: String }, // e.g. "inventory", "users"
    description: { type: String }, // e.g. "added supplier", "added Cable ID: C-102"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
