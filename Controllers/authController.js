import User from "../Models/userModel.js";
import { errorHandler } from "../Utils/Error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "Fill all the required details"));
  }
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });
  try {
    await newUser.save();
    res.status(200).json({ message: "User Registered successfully" });
  } catch (error) {
    next(error);
  }
};
//loginuser
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "Fill all the required fields"));
  }
  //user Details
  try {
    const userDetails = await User.findOne({ email });
    const userPassword = bcryptjs.compareSync(password, userDetails.password);
    if (!userDetails || !userPassword) {
      return next(errorHandler(400, "Invaild credentials"));
    }
    const token = jwt.sign(
      { id: userDetails._id, isAdmin: userDetails.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    const { password: passkey, ...rest } = userDetails._doc;
    res
      .status(200)
      .json({ message: "User loggedIn successfully", token: token, rest });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, profileImg } = req.body;
  try {
    const user = await User.findOne({ email });
    //visitor
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      const { password: passkey, ...rest } = user._doc;

      res
        .status(200)
        .json({ message: "User loggedin succesfully", rest, token });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashPassword,
        profileImage: profileImg,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password: passkey, ...rest } = newUser._doc;
      res
        .status(200)
        .json({ message: "User loggedIn SuccessFully", rest, token });
    }
  } catch (error) {
    next(error);
  }
};
