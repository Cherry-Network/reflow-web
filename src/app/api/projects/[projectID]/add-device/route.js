import { MongoClient, ObjectId } from "mongodb";
import mqtt from "mqtt";

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req, { params }) {
  const { projectID } = params;

  if (!projectID) {
    return new Response("Project ID is required", { status: 400 });
  }

  const { name, serial_no, activation_code, status } = await req.json();

  let initialValues = {};

  if (serial_no.startsWith("AX3")) {
    initialValues = {
      MIN1: 0,
      MAX1: 100,
      FAC1: 0,
      CAL1: 0.0,
      SNO1: "Channel 1",
      MIN2: 0,
      MAX2: 100,
      FAC2: 0,
      CAL2: 0.0,
      SNO2: "Channel 2",
      MIN3: 0,
      MAX3: 100,
      FAC3: 0,
      CAL3: 0.0,
      SNO3: "Channel 3",
    };
  } else if (serial_no.startsWith("AX6")) {
    initialValues = {
      MIN1: 0,
      MAX1: 100,
      FAC1: 0,
      CAL1: 0.0,
      SNO1: "Channel 1",
      MIN2: 0,
      MAX2: 100,
      FAC2: 0,
      CAL2: 0.0,
      SNO2: "Channel 2",
      MIN3: 0,
      MAX3: 100,
      FAC3: 0,
      CAL3: 0.0,
      SNO3: "Channel 3",
      MIN4: 0,
      MAX4: 100,
      FAC4: 0,
      CAL4: 0.0,
      SNO4: "Channel 4",
      MIN5: 0,
      MAX5: 100,
      FAC5: 0,
      CAL5: 0.0,
      SNO5: "Channel 5",
      MIN6: 0,
      MAX6: 100,
      FAC6: 0,
      CAL6: 0.0,
      SNO6: "Channel 6",
    };
  } else if (serial_no.startsWith("AX1")) {
    initialValues = {
      MIN1: 0,
      MAX1: 100,
      FAC1: 0,
      CAL1: 0.0,
      SNO1: "Channel 1",
    };
  } else {
    return new Response("Invalid serial number prefix", { status: 400 });
  }
  try {
    await client.connect();
    const database = client.db("reflowdb");
    const projects = database.collection("projects");
    const devices = database.collection("devices");

    if (!ObjectId.isValid(projectID)) {
      return new Response("Invalid project ID", { status: 400 });
    }

    const existingDevice = await devices.findOne({ seriel_no: serial_no });

    if (existingDevice) {
      return new Response("Device with this serial number already exists", {
        status: 400,
      });
    }

    await devices.insertOne({ serial_no: serial_no });

    const fullDevice = {
      name,
      serial_no: serial_no,
      activation_code,
      status: status || "active",
    };

    const result = await projects.updateOne(
      { _id: new ObjectId(projectID) },
      { $push: { devices: fullDevice } }
    );

    if (result.modifiedCount === 1) {
      const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
      });

      const topic = `${serial_no.slice(0, 3)}/${serial_no.slice(3, 5)}/INPUT`;

      return new Promise((resolve, reject) => {
        mqttClient.on("connect", () => {
          mqttClient.publish(
            topic,
            JSON.stringify(initialValues),
            { retain: true },
            (err) => {
              mqttClient.end();

              if (err) {
                resolve(
                  new Response("Error publishing to MQTT", { status: 500 })
                );
              } else {
                resolve(new Response(JSON.stringify(result), { status: 200 }));
              }
            }
          );
        });

        mqttClient.on("error", (err) => {
          mqttClient.end();
          resolve(new Response("MQTT client error", { status: 500 }));
        });
      });
    } else {
      return new Response("Device not added to the project", { status: 500 });
    }
  } catch (error) {
    return new Response("Error adding device", { status: 500 });
  } finally {
    await client.close();
  }
}
