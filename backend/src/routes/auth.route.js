import { Router } from "express";
import { Login, Logout, onBoard, signUp,forgotPassword,resetPassword } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = Router();

router.post('/signup',signUp);
router.post('/login',Login);
router.post('/logout',Logout);

router.post('/onboarding',protectRoute,onBoard);

router.get('/me', protectRoute, (req,resp) => {
    resp.status(200).json( {success:true, message:'User Get SuccesFully', user : req.user} )
})
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;