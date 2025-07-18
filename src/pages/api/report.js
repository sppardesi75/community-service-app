import { connectToDatabase } from "@/lib/mongodb";
import Issue from "@/models/Issue";
import { verifyToken } from "@/middleware/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectToDatabase();
    const decoded = verifyToken(req);
    const userId = decoded.id;

    const {
      title,
      category,
      description,
      location,
      latitude,
      longitude,
      images,
    } = req.body;

    // Validate required fields
    if (!title || !category || !description || !location || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new issue
    const issue = await Issue.create({
      title,
      category,
      description,
      location,
      latitude,
      longitude,
      status: "Pending Approval",
      userId,
      images: images || [], // from Cloudinary
      updates: [
        {
          text: "Issue submitted and pending approval",
          status: "Pending Approval",
          timestamp: new Date(),
        },
      ],
    });

    return res.status(201).json({ message: "Issue reported successfully", issue });
  } catch (err) {
    console.error("Error creating issue:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
