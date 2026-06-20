const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createPost,
  getPosts,
  deletePost,
  likePost,
  dislikePost,
} = require("../controllers/postController");

router.post("/", authMiddleware, upload.single("image"), createPost);
router.get("/", getPosts);
router.delete("/:id", authMiddleware, deletePost);
router.put("/like/:id", authMiddleware, likePost);
router.put("/dislike/:id", authMiddleware, dislikePost);

module.exports = router;
