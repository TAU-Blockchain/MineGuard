const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Reply content is required"],
    trim: true,
    maxlength: [1000, "Reply cannot be more than 1000 characters"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  votes: {
    upvotes: [
      {
        type: String,
      },
    ],
    downvotes: [
      {
        type: String,
      },
    ],
  },
});

const discussionSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: [true, "Contract address is required"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    maxlength: [2000, "Content cannot be more than 2000 characters"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  replies: [replySchema],
  votes: {
    upvotes: [
      {
        type: String,
      },
    ],
    downvotes: [
      {
        type: String,
      },
    ],
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

discussionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

discussionSchema.virtual("voteCount").get(function () {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

replySchema.virtual("voteCount").get(function () {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

discussionSchema.set("toJSON", { virtuals: true });
replySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Discussion", discussionSchema);
