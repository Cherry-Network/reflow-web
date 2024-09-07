import { Client } from "pg";
import { NextResponse } from "next/server";

// GET handler function for the API route
export async function GET(req) {
  const client = new Client({
    host: "54.89.106.185",
    database: "ax3_db",
    user: "reflow",
    password: "rfcc1234",
    port: 5432,
  });
  // Extract query parameters from the request URL
  const { searchParams } = new URL(req.url);
  const dev_id = searchParams.get("dev_id");

  if (!dev_id) {
    return NextResponse.json({ error: "dev_id is required" }, { status: 400 });
  }

  try {
    await client.connect();

    // Parameterized query to prevent SQL injection
    const query = `SELECT secret_key FROM x3 WHERE dev_id = $1`;
    const result = await client.query(query, [dev_id]);

    if (result.rows.length > 0) {
      return NextResponse.json(
        { secret_key: result.rows[0].secret_key },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "No secret key found for dev_id" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Database query error:", err.stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
