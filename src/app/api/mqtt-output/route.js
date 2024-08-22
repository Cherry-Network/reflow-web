import { NextResponse } from "next/server";
import mqtt from "mqtt";

// MQTT broker configuration
const brokerUrl = "mqtt://mqtt.infinit-i.in:1883";
const options = {
  username: "chakry",
  password: "chakreesh",
};

// Store messages
let mqttData = [];

// Establish connection to the MQTT broker
const client = mqtt.connect(brokerUrl, options);

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("AX3/01/OUTPUT", (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log("Subscribed to AX3/01/OUTPUT");
    }
  });
});

client.on("message", (topic, message) => {
  try {
    const messageString = message.toString();

    // Log the incoming message for debugging
    console.log("Received message:", messageString);

    // Attempt to parse the JSON message
    const parsedMessage = JSON.parse(messageString);

    // Store the parsed message
    mqttData.push(parsedMessage);

    // Keep only the latest 10 messages
    if (mqttData.length > 10) {
      mqttData.shift();
    }
  } catch (error) {
    console.error("Failed to parse MQTT message:", error);
    console.error("Original message:", message.toString());
  }
});

client.on("error", (err) => {
  console.error("Connection error:", err);
});

export async function GET() {
  return NextResponse.json(mqttData);
}
