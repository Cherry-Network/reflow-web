// /app/api/get-data/route.js

import { NextResponse } from "next/server";
import { Pool } from "pg";

// Create PostgreSQL connection pool
const x3_pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.X3_DEVICE_DATA_DB,
  user: process.env.DEVICE_DATA_USER,
  password: process.env.DEVICE_DATA_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const x6_pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.X6_DEVICE_DATA_DB,
  user: process.env.DEVICE_DATA_USER,
  password: process.env.DEVICE_DATA_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const x1_pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.X1_DEVICE_DATA_DB,
  user: process.env.DEVICE_DATA_USER,
  password: process.env.DEVICE_DATA_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const sortData = (data) => {
  return data.sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });
};

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
  const x3_query = `
        SELECT 
            timestamp, 
            ch_1 AS SNO1, 
            ch_2 AS SNO2, 
            ch_3 AS SNO3
        FROM alpha_x3
        WHERE dev_id = $1
          AND timestamp BETWEEN $2 AND $3
    `;

  const x6_query = `
        SELECT 
            timestamp, 
            ch_1 AS SNO1, 
            ch_2 AS SNO2, 
            ch_3 AS SNO3,
            ch_4 AS SNO4,
            ch_5 AS SNO5,
            ch_6 AS SNO6
        FROM alpha_x6
        WHERE dev_id = $1
          AND timestamp BETWEEN $2 AND $3
    `;
  const x1_query = `
        SELECT 
            timestamp,
            ch_1 AS SNO1
        FROM alpha_x1
        WHERE dev_id = $1
          AND timestamp BETWEEN $2 AND $3
    `;
  const values = [dev_id, start_timestamp, end_timestamp];

  try {
    // Querying PostgreSQL
    if (dev_id.startsWith("AX3") || dev_id.startsWith("ax3")) {
      const client = await x3_pool.connect();
      const result = await client.query(x3_query, values);
      client.release(); // Release the client back to the pool

      // Return the query result as JSON
      return NextResponse.json(result.rows);
    } else if (dev_id.startsWith("AX6") || dev_id.startsWith("ax6")) {
      const client = await x6_pool.connect();
      const result = await client.query(x6_query, values);
      client.release(); // Release the client back to the pool

      // Return the query result as JSON
      return NextResponse.json(sortData(result.rows));
    } else if (dev_id.startsWith("AX1") || dev_id.startsWith("ax1")) {
      const client = await x1_pool.connect();
      const result = await client.query(x1_query, values);
      client.release(); // Release the client back to the pool

      // Return the query result as JSON
      return NextResponse.json(sortData(result.rows));
    }
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { error: "Database query error" },
      { status: 500 }
    );
  }
}
