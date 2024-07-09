import mongoose from "mongoose";



const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj3aYzKWsZLarhVhaQdcu4csOM-CoQiBHYoA&s",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    userId: {
      type: String,
      ref: "User",
  
    },

likes:[{
          type:String,
          ref:'User',  
        }
      ],
    share:{
      type:Number,
      default:0,
  },
  comments:[
    {
      text:String,
    createdAt:{ 
        type:Date,
        default:Date.now
      },
      postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true, 
      },
  
    },
  ], 

  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
