import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const database = client.db("reflowdb");
    const users = database.collection("users");

    const { username, name } = await req.json();

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }


    const existingUser = await users.findOne({ username });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "User found",
          user: existingUser,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newUser = {
      name,
      username,
      projectIDs: [],
      sharedAccess: [],
    };

    const result = await users.insertOne(newUser);

    return new Response(
      JSON.stringify({
        message: "New user created",
        user: newUser,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return new Response(
      JSON.stringify({ error: "Error checking/creating user" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
