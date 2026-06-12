import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () { return !this.googleId; }, // Password not required if Google Auth is used
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,
    passwordHistory: {
      type: [
        {
          password: { type: String, required: true },
          changedAt: { type: Date, default: Date.now },
        },
      ],
      select: false, // Don't include history by default
    },
  },
  {
    timestamps: true,
  }
);

// Index for email search
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
