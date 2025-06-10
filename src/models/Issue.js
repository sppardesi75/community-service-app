import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],

    status: {
      type: String,
      enum: ["Pending Approval", "Under Review", "Resolved", "Rejected"],
      default: "Pending Approval",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Issue || mongoose.model("Issue", issueSchema);
