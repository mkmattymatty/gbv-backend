// backend/src/models/SupportLog.js
const mongoose = require('mongoose');

const supportLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  incidentDate: Date,
  abuseType: {
    type: String,
    enum: ['physical', 'emotional', 'sexual', 'financial', 'digital', 'stalking']
  },
  notes: String,
  supportSought: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SupportLog', supportLogSchema);