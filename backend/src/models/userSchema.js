const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
    {
      username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
      },
      emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid email address: " + value);
          }
        },
      },
      password: {
        type: String,
        required: true,
        validate(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error("Enter a Strong Password: " + value);
          }
        },
      },
      age: {
        type: Number,
        min: 18,
      },
      bio: {
        type: String,
        trim: true,
        default: "",
      },
      gender: {
        type: String,
        enum: {
          values: ["male", "female", "other"],
          message: `{VALUE} is not a valid gender type`,
        },
        // validate(value) {
        //   if (!["male", "female", "others"].includes(value)) {
        //     throw new Error("Gender data is not valid");
        //   }
        // },
      },
      photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
          if (!validator.isURL(value)) {
            throw new Error("Invalid Photo URL: " + value);
          }
        },
      },
      posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
      ],
      likedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
      comments: [
            {
                postId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Post",
                },
                text: {
                    type: String,
                    required: [true, "Comment text is required"],
                    trim: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
      timestamps: true,
    }
  );
userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({_id:user._id},"rohitranjanab1718@",{
    expiresIn:"7d",
  });
  return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User",userSchema);