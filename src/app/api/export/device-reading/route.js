// /app/api/get-data/route.js

import { NextResponse } from "next/server";
import { Pool } from "pg";

// Create PostgreSQL connection pool
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: "myax",
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

// Handler for GET requests
export async function GET(request) {
  // Extracting data from headers
  const dev_id = request.headers.get("dev-id");
  const start_timestamp = request.headers.get("start-timestamp");
  const end_timestamp = request.headers.get("end-timestamp");

  // Validate headers (ensuring all required headers are present)
  if (!dev_id || !start_timestamp || !end_timestamp) {
    return NextResponse.json(
      { error: "Missing required headers" },
      { status: 400 }
    );
  }

  // SQL query to retrieve data
  const query = `
        SELECT 
            timestamp, 
            ch_1 AS SNO1, 
            ch_2 AS SNO2, 
            ch_3 AS SNO3
        FROM alpha_x3
        WHERE dev_id = $1
          AND timestamp BETWEEN $2 AND $3
    `;
  const values = [dev_id, start_timestamp, end_timestamp];

  try {
    // Querying PostgreSQL
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release(); // Release the client back to the pool

    // Return the query result as JSON
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { error: "Database query error" },
      { status: 500 }
    );
  }
}
