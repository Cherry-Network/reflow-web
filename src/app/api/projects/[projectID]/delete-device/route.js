import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function DELETE(req, { params }) {
  const { projectID } = params;
  const { serial_no } = await req.json();

  if (!projectID || !serial_no) {
    return new Response("Project ID and Serial Number are required", {
      status: 400,
    });
  }

  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");
    const devices = database.collection("devices");

    if (!ObjectId.isValid(projectID)) {
      return new Response("Invalid project ID", { status: 400 });
    }

    const deviceDeletionResult = await devices.deleteOne({ serial_no });

    if (deviceDeletionResult.deletedCount === 0) {
      return new Response("Device not found in devices collection", {
        status: 404,
      });
    }

    const projectUpdateResult = await projects.updateOne(
      { _id: new ObjectId(projectID) },
      { $pull: { devices: { serial_no } } }
    );

    if (projectUpdateResult.modifiedCount === 0) {
      return new Response("Device not found in project", { status: 404 });
    }

    return new Response("Device successfully deleted", { status: 200 });
  } catch (error) {
    return new Response("Error deleting device", { status: 500 });
  } finally {
    await client.close();
  }
}
