import { NextResponse } from "next/server";
import mqtt from "mqtt";

// MQTT broker configuration
const brokerUrl = "mqtt://mqtt.infinit-i.in:1883";
const options = {
  username: "chakry",
  password: "chakreesh",
};

// Store the most recent message per device serial number
let mqttData = {};
let subscribedTopics = new Set();

// Function to dynamically generate the MQTT topic based on the serial number
const generateMqttTopic = (serialId) => {
  const prefix = serialId.slice(0, 3); // e.g., "AX3"
  const suffix = serialId.slice(3, 5); // e.g., "03"
  return `${prefix}/${suffix}/OUTPUT`; // e.g., "AX3/03/OUTPUT"
};

// Establish connection to the MQTT broker
const client = mqtt.connect(brokerUrl, options);

client.on("connect", () => {
  console.log("Connected to MQTT broker");
});

client.on("message", (topic, message) => {
  try {
    const messageString = message.toString();
    console.log("Received message:", messageString);

    const parsedMessage = JSON.parse(messageString);
    const fullSerialId = topic.split("/")[0] + topic.split("/")[1]; // e.g., AX303

    // Store only the most recent message for each serialId
    mqttData[fullSerialId] = parsedMessage;

    console.log("Stored data:", mqttData);
  } catch (error) {
    console.error("Failed to parse MQTT message:", error);
    console.error("Original message:", message.toString());
  }
});

client.on("error", (err) => {
  console.error("Connection error:", err);
});

// Subscribe to a dynamically generated topic based on the serial number
const subscribeToTopic = async (serialId) => {
  const topic = generateMqttTopic(serialId);
  if (!subscribedTopics.has(topic)) {
    return new Promise((resolve, reject) => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
          reject(err);
        } else {
          console.log(`Subscribed to ${topic}`);
          subscribedTopics.add(topic);
          resolve();
        }
      });
    });
  }
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const serialId = searchParams.get("serialId");

  if (!serialId) {
    return NextResponse.json(
      { error: "serialId parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Subscribe to the topic for this device if not already subscribed
    await subscribeToTopic(serialId);

    // Wait for a short period to allow subscription and message reception
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return the most recent data for the requested serial number
    const data = mqttData[serialId] || {};
    console.log("Returned data for serialId:", serialId, "Data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
