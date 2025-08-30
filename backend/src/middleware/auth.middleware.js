import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

export const protectRoute = async (req, resp, next) => {
    try {
        const token = req.cookies.Jwt;

        if (!token) {
             return resp.status(401).json({message:"Unauthroized - No Token Provided"})
        };

        const decodedToken = jwt.verify(token,process.env.JWT_SECERT);
        if (!decodedToken) {
             return resp.status(401).json({message:"Unauthroized - Invalid Token"})
        };

        const user = await User.findById(decodedToken.userId).select("-password")
        if (!user) {
             return resp.status(401).json({message:"Unauthroized - User Not Found"})
        };

        req.user = user
        next()
    } catch (error) {
        console.log('Error in ProtectRoute Middleware',error);
    }
};