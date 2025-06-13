// ✅ Use ESM import syntax instead of require
import nextConnect from "next-connect";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Issue from "@/models/Issue";
import { verifyToken } from "@/middleware/auth";

// Setup upload dir
const uploadDir = path.join(process.cwd(), "/public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure multer
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage, limits: { files: 5 } });

// Create handler
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong!: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Middleware
apiRoute.use(upload.array("images", 5));

apiRoute.post(async (req, res) => {
  await connectToDatabase();

  try {
   let userId;
try {
  const decoded = verifyToken(req);
  userId = decoded.id;
} catch (error) {
  return res.status(401).json({ message: error.message });
}

    const { title, category, description, location } = req.body;
    const imagePaths = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const issue = await Issue.create({
      title,
      category,
      description,
      location,
      userId,
      status: "Pending Approval", 
      images: imagePaths,
    });

    return res.status(201).json({ message: "Issue submitted", issueId: issue._id });
  } catch (err) {
    console.error("Report submission error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// ✅ Export as default for ESM
export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
