import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      minlength: 4,
    },
    user_name: {
      type: String,
      minlength: [4, "user_name length must great than 4 "],
      required: function () {
        return this.provider == "system";
      },
      unique: true,
    },
    age: {
      type: Number,
      required: function () {
        return this.provider == "system";
      },
      min: [16, "your age must be 16 or greater"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9-.+#]+@gmail.com$/, "invalid Email"],
    },
    phone: {
      type: String,
      required: function () {
        return this.provider == "system";
      },
    },
    role: { type: String, enum: ["user", "Admin"], default: "user" },
    address: {
      type: String,
      required: function () {
        return this.provider == "system";
      },
    },
    password: {
      type: String,
      required: function () {
        return this.provider == "system";
      },
    },
    subId: {
      type: Number,
    },
    provider: {
      type: String,
      required: true,
      enum: ["system", "google"],
      default: "system",
    },
    profileImg: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    isconfirmed: {
      type: Boolean,
      default: false,
    },
    isbanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
