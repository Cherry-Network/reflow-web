import { MongoClient, ObjectId } from "mongodb";
import mqtt from "mqtt";

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req, { params }) {
  const { projectID } = params;

  if (!projectID) {
    return new Response("Project ID is required", { status: 400 });
  }

  const { name, serial_no, activation_code, status } = await req.json();

  // Define the default initial values
  const initialValues = {
    MIN1: 10,
    MAX1: 50,
    FAC1: 0,
    CAL1: 0.5,
    SNO1: "A123",
    MIN2: 5,
    MAX2: 30,
    FAC2: 0,
    CAL2: 1.0,
    SNO2: "B456",
    MIN3: 20,
    MAX3: 80,
    FAC3: 0,
    CAL3: 0.8,
    SNO3: "C789",
  };

  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");

    if (!ObjectId.isValid(projectID)) {
      console.log("MONGODB_URI:", process.env.MONGODB_URI);
      return new Response("Invalid project ID", { status: 400 });
    }

    // Add the device to the project
    const result = await projects.updateOne(
      { _id: new ObjectId(projectID) },
      { $push: { devices: { name, serial_no, activation_code, status } } }
    );

    // If the device was successfully added, proceed with MQTT
    if (result.modifiedCount === 1) {
      const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
      });

      // Constructing the topic based on the serial number
      const topic = `${serial_no.slice(0, 3)}/${serial_no.slice(3, 5)}/INPUT`;

      return new Promise((resolve, reject) => {
        mqttClient.on("connect", () => {
          // Publish the initial values to the MQTT topic with the retain flag
          mqttClient.publish(
            topic,
            JSON.stringify(initialValues),
            { retain: true },
            (err) => {
              mqttClient.end();

              if (err) {
                console.error("Error publishing to MQTT:", err);
                resolve(
                  new Response("Error publishing to MQTT", { status: 500 })
                );
              } else {
                console.log(`Published to topic: ${topic} with retain flag`);
                resolve(new Response(JSON.stringify(result), { status: 200 }));
              }
            }
          );
        });

        mqttClient.on("error", (err) => {
          mqttClient.end();
          console.error("MQTT client error:", err);
          resolve(new Response("MQTT client error", { status: 500 }));
        });
      });
    } else {
      return new Response("Device not added to the project", { status: 500 });
    }
  } catch (error) {
    console.error("Error adding device:", error);
    return new Response("Error adding device", { status: 500 });
  } finally {
    await client.close();
  }
}
