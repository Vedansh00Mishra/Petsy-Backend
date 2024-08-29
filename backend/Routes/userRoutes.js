import express from 'express';
import { getUser, Login, Logout, SignUp } from '../Controllers/userController.js';
import requireAuth from '../middlewares/protectRoute.js';

const router = express.Router();

router.post("/register", SignUp);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/getuser",requireAuth,getUser)

export default router;
