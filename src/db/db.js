const mongoose = require("mongoose");

const uri =
  "mongodb+srv://devanandk:NDKNiMNfAYHkemiX@clusterreflow.66omo.mongodb.net/";

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seriel_no: { type: String, required: true },
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
