// /src/pages/api/issues/assigned.js
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/middleware/auth";
import Issue from "@/models/Issue";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDatabase();

    const decoded = verifyToken(req);
    const userId = decoded.id;
    const role = decoded.role;

    if (role !== "clerk") {
      return res.status(403).json({ message: "Access denied. Clerk only." });
    }

    const issues = await Issue.find({ assignedTo: userId }).sort({ createdAt: -1 });

    return res.status(200).json({ issues });
  } catch (err) {
    console.error("Error fetching assigned issues:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
