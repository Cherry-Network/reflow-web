import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { Project } from "@/db/db";

const uri = "mongodb://localhost:27017/reflowdb";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function POST(req) {
  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");

    const body = await req.json();

    const { name, description, devices } = body;

    const result = await projects.insertOne({
      name,
      description,
      devices,
    });

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



export async function GET() {
  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects"); 

    const projectList = await projects.find({}).toArray();

    return new Response(JSON.stringify(projectList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response("Error fetching projects", { status: 500 });
  } finally {
    await client.close();
  }
}
