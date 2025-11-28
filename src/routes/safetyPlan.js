const express = require("express");
const SafetyPlan = require("../models/SafetyPlan");
const requireAuth = require("../middleware/requireAuth");
const checkUser = require("../middleware/checkUser");

const router = express.Router();

// Get safety plan
router.get("/", requireAuth, async (req, res) => {
  try {
    let plan = await SafetyPlan.findOne({ userId: req.userId });
    if (!plan) {
      plan = new SafetyPlan({ userId: req.userId });
      await plan.save();
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch safety plan" });
  }
});

// Update safety plan
router.put("/", requireAuth, async (req, res) => {
  try {
    let plan = await SafetyPlan.findOne({ userId: req.userId });

    if (!plan) {
      plan = new SafetyPlan({ userId: req.userId, ...req.body });
    } else {
      Object.assign(plan, req.body);
      plan.updatedAt = Date.now();
    }

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: "Failed to update safety plan" });
  }
});

module.exports = router;
