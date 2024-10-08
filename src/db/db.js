const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  serial_no: { type: String, required: true, unique: true },
});


const fullDeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serial_no: { type: String, required: true },
  activation_code: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});


const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  devices: [fullDeviceSchema],
  owner: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  projectIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  sharedAccess: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});


const Device = mongoose.models.Device || mongoose.model("Device", deviceSchema);
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = { Project, User, Device };
