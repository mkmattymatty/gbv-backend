const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail, isEmpty } = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please Enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "minimun password length is 8 characters"],
    },
    username: {
      type: String,
      required: true,
    },
    emergencyContact: {
      name: String,
      phone: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Fixed pre-save hook for async
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Handling the login
userSchema.statics.login = async (email, password) => {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }

  throw Error("Incorrect Email");
};
module.exports = mongoose.model("User", userSchema);
