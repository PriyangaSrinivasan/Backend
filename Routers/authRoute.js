import express from 'express';
import { google, loginUser, registerUser } from '../Controllers/authController.js';


const router =express.Router();


router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/google',google)



export default router; 