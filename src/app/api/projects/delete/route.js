// app/api/projects/delete/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("reflowdb");

    const { projectId } = await req.json();

    if (!projectId || !ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { message: "Invalid or missing Project ID" },
        { status: 400 }
      );
    }

    const projectsCollection = db.collection("projects");
    const usersCollection = db.collection("users");
    const devicesCollection = db.collection("devices");

    const project = await projectsCollection.findOne({
      _id: new ObjectId(projectId),
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const deviceSerialNos = project.devices.map((device) => device.serial_no);

    const projectDeletionResult = await projectsCollection.deleteOne({
      _id: new ObjectId(projectId),
    });

    if (projectDeletionResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Failed to delete the project" },
        { status: 500 }
      );
    }

    await usersCollection.updateMany(
      {
        $or: [
          { projectIDs: new ObjectId(projectId) },
          { sharedAccess: new ObjectId(projectId) },
        ],
      },
      {
        $pull: {
          projectIDs: new ObjectId(projectId),
          sharedAccess: new ObjectId(projectId),
        },
      }
    );

    if (deviceSerialNos.length > 0) {
      await devicesCollection.deleteMany({
        serial_no: { $in: deviceSerialNos },
      });
    }

    return NextResponse.json(
      { message: "Project and related devices deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
