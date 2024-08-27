import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET(req, { params }) {
  const { projectID } = params;

  if (!projectID || !ObjectId.isValid(projectID)) {
    return new Response("Invalid or missing project ID", { status: 400 });
  }

  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");

    const project = await projects.findOne(
      { _id: new ObjectId(projectID) },
      { projection: { devices: 1, name: 1 } }
    );

    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    return new Response(JSON.stringify(project), { status: 200 });
  } catch (error) {
    console.error("Error fetching project devices:", error);
    return new Response("Error fetching project devices", { status: 500 });
  } finally {
    await client.close();
  }
}
