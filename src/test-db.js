const mongoose = require("mongoose");
const { Project } = require("./db/db");


mongoose
  .connect("mongodb://localhost:27017/reflowdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const createProject = async () => {
  const project = new Project({
    name: "IoT Monitoring System",
    description: "A project to monitor IoT devices.",
    devices: [
      { name: "Temperature Sensor", type: "Sensor", status: "active" },
      { name: "Humidity Sensor", type: "Sensor" },
    ],
  });

  try {
    await project.save();
    console.log("Project created:", project);
  } catch (err) {
    console.error("Error creating project:", err);
  } finally {
    mongoose.connection.close();
  }
};

createProject();
