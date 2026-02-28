import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    // ✅ Admin uses email, Shop can have email null
    email: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows multiple null emails
      trim: true,
      default: null
    },

    // ✅ Shop uses phone as username
    phone: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows multiple null phones
      trim: true,
      default: null
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["admin", "shop"],
      default: "shop"
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);