import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    await client.connect();
    const database = client.db("reflowdb");
    const users = database.collection("users");

    const { username } = await req.json();

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user already exists
    let user = await users.findOne({ username });

    if (!user) {
      // Create new user if not found
      const result = await users.insertOne({
        username,
        projectIDs: [],
        sharedAccess: [],
      });
      user = result.ops[0]; // Get the newly created user
    }

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return new Response(JSON.stringify({ error: "Error processing request" }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}
