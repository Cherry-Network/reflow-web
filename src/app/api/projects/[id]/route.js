import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017/reflowdb";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function PATCH(req, { params }) {
  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");

    const projectId = params.id;
    const body = await req.json();

    const { devices } = body;

    const result = await projects.updateOne(
      { _id: new ObjectId(projectId) },
      { $push: { devices: { $each: devices } } }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Devices added successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding devices:", error);
    return new Response(JSON.stringify({ error: "Error adding devices" }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}
