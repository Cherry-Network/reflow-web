// src/app/api/mqtt-input/route.js

import mqtt from "mqtt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse JSON from the request body
    const deviceInput = await request.json();

    // Connect to MQTT broker
    const client = mqtt.connect("mqtt://mqtt.infinit-i.in:1883", {
      username: "chakry",
      password: "chakreesh",
    });

    // Return a promise that resolves or rejects based on the MQTT operations
    return new Promise((resolve, reject) => {
      client.on("connect", () => {
        // Publish the data
        client.publish("AX3/10/IN", JSON.stringify(deviceInput), (err) => {
          if (err) {
            resolve(
              NextResponse.json(
                { message: "Failed to publish" },
                { status: 500 }
              )
            );
          } else {
            client.end(); // Disconnect after publishing
            resolve(
              NextResponse.json(
                { message: "Data published successfully" },
                { status: 200 }
              )
            );
          }
        });
      });

      client.on("error", (err) => {
        resolve(
          NextResponse.json({ message: "Connection error" }, { status: 500 })
        );
      });
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error parsing request body" },
      { status: 400 }
    );
  }
}
