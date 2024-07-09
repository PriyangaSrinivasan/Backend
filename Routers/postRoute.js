import express from "express";
import {
  commentPost,
  createpost,
  deleteBlog,
  getAllposts,
  getBlogById,
  getuserPosts,
  likePost,
  sharePost,
  updateBlog,
} from "../Controllers/postController.js";
import { middleware } from "../Middleware/middleware.js";

const router = express.Router();

router.post("/create-post", middleware, createpost);
router.get("/getposts", getAllposts);
router.put("/updatepost/:id", middleware, updateBlog);
router.delete("/deletepost/:id", middleware, deleteBlog);
router.get("/getpost/:id", middleware, getBlogById);
router.get("/userpost",middleware,getuserPosts)
router.post("/likepost/:id",middleware,likePost)
router.post("/sharepost/:id",middleware,sharePost)
router.post("/comment/:id",middleware,commentPost);


export default router;
