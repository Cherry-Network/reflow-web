require("dotenv").config({ path: ".env.local" });
const { MongoClient, ObjectId } = require("mongodb");

// Retrieve the MongoDB URI from the .env.local file
const uri = "mongodb://localhost:27017/";

if (!uri) {
  console.error(
    "MongoDB connection string is missing. Ensure MONGODB_URI is set in .env.local."
  );
  process.exit(1);
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function addDeviceToProject(projectId, deviceData) {
  try {
    await client.connect();
    const database = client.db("reflowdb"); // Replace with your actual database name
    const projects = database.collection("projects"); // Replace with your actual collection name

    const result = await projects.updateOne(
      { _id: new ObjectId(projectId) },
      { $push: { devices: deviceData } }
    );

    if (result.modifiedCount === 1) {
      console.log(`Successfully added device to project with ID: ${projectId}`);
    } else {
      console.log(`Failed to add device. Project ID may not exist.`);
    }
  } catch (error) {
    console.error("Error adding device to project:", error);
  } finally {
    await client.close();
  }
}

// Example usage
const projectId = "66c9dbd74604a300fa62c42d"; // Replace with the actual project ID
const deviceData = {
  name: "Device 1",
  serial_no: "12345XYZ",
  status: "active",
  // Add more fields as needed
};

addDeviceToProject(projectId, deviceData);
