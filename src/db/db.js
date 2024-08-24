// db.js or a separate schema file
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  devices: [deviceSchema],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
