import User from "../Models/userModel.js";
import { errorHandler } from "../Utils/Error.js";
import bcryptjs from 'bcryptjs'

export const updateuser = async (req, res, next) => {
  const {id} =req.params.id;
  if(req.user._id !==id){
    return next(errorHandler(400,"your're not allowed to update this user"))
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }
  try {
    const updateduser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profileImage: req.body.profileImage,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateduser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteuser =async(req,res,next)=>{
  try {
    const id =req.params.id;
    const userexit =await User.findById(id);
    if(!userexit){
      return res.status(401).json({message:"User not found"});
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({message:"User deleted successfully"})

  } catch (error) {
    next(error)
  }
}



