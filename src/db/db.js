const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seriel_no: { type: String, required: true },
  activation_code: {type: String, required: true},
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  devices: [deviceSchema],
});

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

module.exports = { Project };
