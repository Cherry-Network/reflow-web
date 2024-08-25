import mqtt from "mqtt";

export async function POST(req) {
  try {
    const client = mqtt.connect("mqtt://mqtt.infinit-i.in:1883", {
      username: "chakry",
      password: "chakreesh",
    });

    const { topic, ...data } = await req.json(); // Parse JSON body from request

    return new Promise((resolve, reject) => {
      client.on("connect", () => {
        client.publish(topic, JSON.stringify(data), (err) => {
          if (err) {
            client.end();
            resolve(
              new Response(
                JSON.stringify({ success: false, error: err.message }),
                { status: 500 }
              )
            );
          } else {
            client.end();
            resolve(
              new Response(JSON.stringify({ success: true, topic, data }), {
                status: 200,
              })
            );
          }
        });
      });

      client.on("error", (err) => {
        client.end();
        resolve(
          new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
          })
        );
      });
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
