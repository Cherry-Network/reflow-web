import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "../../../db/db"; 

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; 
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "reflowdb",
  });
  console.log("Connected to DB:", mongoose.connection.name);
};



export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { username } = body;

    const defaultPassword = "defaultPassword123"; // Set a default password

    const newUser = new User({
      username,
      password: defaultPassword,
      projectIDs: [],
      sharedAccess: [],
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Error registering user" },
      { status: 500 }
    );
  }
}
