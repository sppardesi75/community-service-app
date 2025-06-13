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

    // ✅ New: Track update history (displayed on right-side panel)
    updates: [
      {
        type: String, // Example: "Update 01: The issue is submitted..."
      },
    ],


    feedbacks: [
      {
        rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    anonymous: { type: Boolean, default: true },
    submissionDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Issue || mongoose.model("Issue", issueSchema);
