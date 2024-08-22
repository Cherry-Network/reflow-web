
const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: String,
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', DeviceSchema);
