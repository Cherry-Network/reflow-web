import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req) {
  try {
    await client.connect();
    const database = client.db("reflowdb");
    const users = database.collection("users");

    const { username, projectID } = await req.json();

    if (!username || !projectID) {
      return new Response(
        JSON.stringify({ error: "Username and projectID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await users.updateOne(
      { username },
      { $addToSet: { sharedAccess: new ObjectId(projectID) } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to update access" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: "Access provided successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error providing access:", error);
    return new Response(JSON.stringify({ error: "Error providing access" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}
