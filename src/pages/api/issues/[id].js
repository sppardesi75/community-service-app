import { connectToDatabase } from "@/lib/mongodb";
import Issue from "@/models/Issue";
import { verifyToken } from "@/middleware/auth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;
  const {
    query: { id },
  } = req;

  await connectToDatabase();

  if (method !== "GET") {
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }

  try {
    const decoded = verifyToken(req);
    const userId = decoded.id;

    // Convert id to ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    const issue = await Issue.findOne({ _id: objectId, userId });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({
      issue: {
        id: issue._id,
        title: issue.title,
        category: issue.category,
        description: issue.description,
        status: issue.status,
        createdAt: issue.createdAt,
        location: issue.location,
        images: issue.images || [],
        updates: issue.updates || [],
        feedback: issue.feedbacks || [],
      },
    });
  } catch (err) {
    console.error("Error fetching issue details:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
