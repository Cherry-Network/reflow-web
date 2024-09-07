// app/api/projects/route.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function POST(req) {
  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");
    const users = database.collection("users");

    const body = await req.json();
    const { name, description, devices, username } = body;

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert the new project with the owner field
    const result = await projects.insertOne({
      name,
      description,
      devices,
      owner: username, // Set the owner to the username
    });

    // Update the user's projectIDs array
    await users.updateOne(
      { username },
      { $push: { projectIDs: result.insertedId } }
    );

    return new Response(
      JSON.stringify({
        message: "Project added successfully",
        projectId: result.insertedId,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error adding project:", error);
    return new Response(JSON.stringify({ error: "Error adding project" }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}

export async function GET(req) {
  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");
    const users = database.collection("users");

    // Get the username from sessionStorage
    // Note: Fetching sessionStorage directly in server-side code is not possible.
    // This needs to be sent from the client-side code as part of the request.
    const username = req.headers.get("username"); // Modify this line based on your actual implementation

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the user and get their project IDs
    const user = await users.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch projects associated with the user
    const projectList = await projects
      .find({ _id: { $in: user.projectIDs } })
      .toArray();

    return new Response(JSON.stringify(projectList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response(JSON.stringify({ error: "Error fetching projects" }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}