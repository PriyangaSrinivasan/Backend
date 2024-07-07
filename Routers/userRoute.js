import express from "express";
import { deleteuser, updateuser } from "../Controllers/userController.js";
import { middleware } from "../Middleware/middleware.js";

const router = express.Router();

router.put("/edit/:id", middleware, updateuser);
router.delete("/delete/:id", middleware, deleteuser);

export default router;
