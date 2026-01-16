import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"; // ← don't forget to install: npm i bcryptjs

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [30, "First name cannot exceed 30 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [30, "Last name cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [100, "Password is too long"],
      select: false,
      validate: [
        function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 symbol",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Optional: compare password method (very convenient)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Optional: normalize email (you can keep it, but lowercase+trim already exist)
userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase().trim();
  }
});

export const User = mongoose.model("User", userSchema);
