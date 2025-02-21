const Discussion = require("../models/discussion.model");

exports.getDiscussions = async (req, res) => {
  try {
    const { contractAddress, page = 1, limit = 10 } = req.query;
    const query = {};

    if (contractAddress) {
      query.contractAddress = contractAddress;
    }

    const discussions = await Discussion.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Discussion.countDocuments(query);

    res.status(200).json({
      success: true,
      data: discussions,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalDiscussions: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching discussions",
      error: error.message,
    });
  }
};

exports.getDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.views += 1;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching discussion",
      error: error.message,
    });
  }
};

exports.createDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.create(req.body);

    res.status(201).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating discussion",
      error: error.message,
    });
  }
};

exports.addReply = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.replies.push(req.body);
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error adding reply",
      error: error.message,
    });
  }
};

exports.voteDiscussion = async (req, res) => {
  try {
    const { walletAddress, voteType } = req.body;
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.votes.upvotes = discussion.votes.upvotes.filter(
      (addr) => addr !== walletAddress
    );
    discussion.votes.downvotes = discussion.votes.downvotes.filter(
      (addr) => addr !== walletAddress
    );

    if (voteType === "upvote") {
      discussion.votes.upvotes.push(walletAddress);
    } else if (voteType === "downvote") {
      discussion.votes.downvotes.push(walletAddress);
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error voting on discussion",
      error: error.message,
    });
  }
};

exports.voteReply = async (req, res) => {
  try {
    const { walletAddress, voteType } = req.body;
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    const reply = discussion.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    reply.votes.upvotes = reply.votes.upvotes.filter(
      (addr) => addr !== walletAddress
    );
    reply.votes.downvotes = reply.votes.downvotes.filter(
      (addr) => addr !== walletAddress
    );

    if (voteType === "upvote") {
      reply.votes.upvotes.push(walletAddress);
    } else if (voteType === "downvote") {
      reply.votes.downvotes.push(walletAddress);
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error voting on reply",
      error: error.message,
    });
  }
};
