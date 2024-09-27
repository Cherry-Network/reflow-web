// app/api/deleteProject/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db('reflowdb'); // Replace with your database name

    // Parse the body to get projectId from the request
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
    }

    // Delete the project by ObjectId
    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(projectId) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred', error: error.message }, { status: 500 });
  }
}
