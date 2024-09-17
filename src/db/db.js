const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seriel_no: { type: String, required: true },
  activation_code: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  devices: [deviceSchema],
  owner: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  projectIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  sharedAccess: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = { Project, User };
