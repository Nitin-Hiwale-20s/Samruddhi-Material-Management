const { getModel, ALLOWED_MODULES } = require("../models/genericModel");
const logActivity = require("../utils/logActivity");

// Try to find a good "label" field on a record to describe it in the activity feed
function pickLabel(body) {
  const candidates = [
    "itemName", "equipmentName", "laneNo", "installationName",
    "cableId", "taskName", "name", "title",
  ];
  for (const key of candidates) {
    if (body[key]) return String(body[key]);
  }
  return "record";
}

// GET /api/:module
const getAll = async (req, res) => {
  const Model = getModel(req.params.module);
  if (!Model) return res.status(404).json({ message: "Unknown module" });
  try {
    const docs = await Model.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/:module/:id
const getOne = async (req, res) => {
  const Model = getModel(req.params.module);
  if (!Model) return res.status(404).json({ message: "Unknown module" });
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/:module
const create = async (req, res) => {
  const Model = getModel(req.params.module);
  if (!Model) return res.status(404).json({ message: "Unknown module" });
  try {
    const body = { ...req.body };
    delete body._id;
    body.createdBy = req.user ? req.user.name : "system";
    const doc = await Model.create(body);

    logActivity(
      req.user?.name,
      "added",
      req.params.module,
      `added ${pickLabel(body)} in ${req.params.module}`
    );

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/:module/:id
const update = async (req, res) => {
  const Model = getModel(req.params.module);
  if (!Model) return res.status(404).json({ message: "Unknown module" });
  try {
    const body = { ...req.body };
    delete body._id;
    const doc = await Model.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ message: "Not found" });

    logActivity(
      req.user?.name,
      "updated",
      req.params.module,
      `updated ${pickLabel(body)} in ${req.params.module}`
    );

    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/:module/:id
const remove = async (req, res) => {
  const Model = getModel(req.params.module);
  if (!Model) return res.status(404).json({ message: "Unknown module" });
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    logActivity(
      req.user?.name,
      "deleted",
      req.params.module,
      `deleted a record from ${req.params.module}`
    );

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/summary  -> counts for every module, used by Dashboard stat cards
const dashboardSummary = async (req, res) => {
  try {
    const summary = {};
    for (const mod of ALLOWED_MODULES) {
      const Model = getModel(mod);
      summary[mod] = await Model.countDocuments();
    }
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/trend -> monthly record-creation counts (last 6 months), combined across modules
// Used to draw the "Monthly Activity Trend" chart.
const dashboardTrend = async (req, res) => {
  try {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      });
    }
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const totals = {};
    months.forEach((m) => (totals[m.key] = 0));

    for (const mod of ALLOWED_MODULES) {
      const Model = getModel(mod);
      const docs = await Model.find(
        { createdAt: { $gte: sixMonthsAgo } },
        { createdAt: 1 }
      );
      docs.forEach((doc) => {
        const d = new Date(doc.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (totals[key] !== undefined) totals[key] += 1;
      });
    }

    const result = months.map((m) => ({ month: m.label, count: totals[m.key] }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  dashboardSummary,
  dashboardTrend,
};
