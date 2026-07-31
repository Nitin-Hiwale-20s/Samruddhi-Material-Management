const express = require("express");
const router = express.Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove,
  dashboardSummary,
  dashboardTrend,
} = require("../controllers/dataController");
const { protect } = require("../middleware/auth");

router.get("/dashboard/summary", protect, dashboardSummary);
router.get("/dashboard/trend", protect, dashboardTrend);

router.get("/:module", protect, getAll);
router.get("/:module/:id", protect, getOne);
router.post("/:module", protect, create);
router.put("/:module/:id", protect, update);
router.delete("/:module/:id", protect, remove);

module.exports = router;
