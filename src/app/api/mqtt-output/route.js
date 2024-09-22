import { NextResponse } from "next/server";
import mqtt from "mqtt";

const brokerUrl = process.env.MQTT_BROKER_URL;
const options = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

const client = mqtt.connect(brokerUrl, options);

let mqttData = {};
const subscribedTopics = new Set(); // Track subscribed topics

const generateMqttTopic = (serialId) => {
  const prefix = serialId.slice(0, 3);
  const suffix = serialId.slice(3, 5);
  return `${prefix}/${suffix}/OUTPUT`;
};

client.on("connect", () => {
  console.log("Connected to MQTT broker");
});

client.on("message", (topic, message) => {
  const messageString = message.toString();
  const parsedMessage = JSON.parse(messageString);
  const fullSerialId = topic.split("/")[0] + topic.split("/")[1];

  if (!mqttData[fullSerialId]) {
    mqttData[fullSerialId] = [];
  }
  mqttData[fullSerialId].push(parsedMessage);

  // Keep only the latest message
  if (mqttData[fullSerialId].length > 1) {
    mqttData[fullSerialId].shift();
  }
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const serialId = searchParams.get("serialId");

  if (!serialId) {
    return NextResponse.json(
      { error: "serialId parameter is required" },
      { status: 400 }
    );
  }

  const topic = generateMqttTopic(serialId);

  // Subscribe only if not already subscribed
  if (!subscribedTopics.has(topic)) {
    client.subscribe(topic);
    subscribedTopics.add(topic);
  }

  // Allow some time for data to be received
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const data = mqttData[serialId] || [];
  return NextResponse.json(data);
}
