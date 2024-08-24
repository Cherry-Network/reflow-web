const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "maintenance"],
    default: "inactive",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  devices: [deviceSchema],
});


const Device = mongoose.model("Device", deviceSchema);
const Project = mongoose.model("Project", projectSchema);

module.exports = { Project, Device };
