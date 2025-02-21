const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");

// Get all discussions with optional filtering
router.get("/", discussionController.getDiscussions);

// Get a single discussion
router.get("/:id", discussionController.getDiscussion);

// Create a new discussion
router.post("/", discussionController.createDiscussion);

// Add a reply to a discussion
router.post("/:id/replies", discussionController.addReply);

// Vote on discussion
router.post("/:id/vote", discussionController.voteDiscussion);

// Vote on reply
router.post("/:id/replies/:replyId/vote", discussionController.voteReply);

module.exports = router;
