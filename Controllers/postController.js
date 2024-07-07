import Post from "../Models/postModel.js";
import { errorHandler } from "../Utils/Error.js";

export const createpost = async (req, res, next) => {
  if (!req.body.title || !req.body.description) {
    return next(errorHandler(401, "All the Fields are Required"));
  }

  const { title, category, description, image } = req.body;

  const newPost = new Post({
    title,
    category,
    description,
    image,
    userId: req.user.id,
    likes: [],
  });
  try {
    const savedPost = await newPost.save();
    res
      .status(200)
      .json({ message: "Post created Successfully", result: savedPost });
  } catch (error) {
    next(error);
  }
};

export const getAllposts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username profileImage")
      .populate("comments.postedBy", "username profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  const { id } = req.params.id;
  if (req.user._id !== id) {
    return next(errorHandler(400, "your're not allowed to update this post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
export const deleteBlog = async (req, res, next) => {
  const { id } = req.params.id;
  if (req.user._id !== id) {
    return next(errorHandler(400, "your're not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    .populate("userId","username profileImage")
    .populate("comments.postedBy","username profileImage");
    if(!post){
      return next(errorHandler(400, "post not Found"));
    }

    res.status(200).json({ post: post });
  } catch (error) {
    next(error);
  }
};

export const getuserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user.id });
    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(400, "post not found"));
    }
    const userIndex = post.likes.findIndex((id) => id === userId);
    if (userIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(userIndex, 1);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const commentPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(errorHandler(400, "Post not found"));
    }
    const comment = {
      text: req.body.comment,
      postedBy: req.user.id,
      createAt: new Date(),
    };
    post.comments.push(comment);
    await post.save();
    await post.populate("comments.postedBy", "username profileImage");
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const sharePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(errorHandler(400, "Post not FOund"));
    }
    post.share += 1;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};
