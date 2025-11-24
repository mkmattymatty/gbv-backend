// backend/src/models/SafetyPlan.js
const mongoose = require('mongoose');

const safetyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  safePlaces: [{
    name: String,
    address: String,
    notes: String
  }],
  trustedContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  warningSignals: [String],
  copingStrategies: [String],
  importantDocuments: [String],
  financialPlanning: {
    hasAccount: Boolean,
    accountLocation: String,
    emergencyFunds: String
  },
  transportationPlan: String,
  childrenSafety: String,
  notes: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SafetyPlan', safetyPlanSchema);
