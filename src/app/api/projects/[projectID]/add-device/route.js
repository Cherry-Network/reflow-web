import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req, { params }) {
  const { projectID } = params;

  if (!projectID) {
    return new Response("Project ID is required", { status: 400 });
  }

  const { name, serial_no, activation_code, status } = await req.json();

  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");

    if (!ObjectId.isValid(projectID)) {
        console.log("MONGODB_URI:", process.env.MONGODB_URI);

      return new Response("Invalid project ID", { status: 400 });
    }

    const result = await projects.updateOne(
      { _id: new ObjectId(projectID) },
      { $push: { devices: { name, serial_no, activation_code, status } } }
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error adding device:", error);
    return new Response("Error adding device", { status: 500 });
  } finally {
    await client.close();
  }
}
