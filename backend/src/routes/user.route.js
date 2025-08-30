import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFriends, getRecommandUser, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendReqs } from "../controller/user.controller.js";

const router = Router();

router.use(protectRoute);

router.get('/',getRecommandUser);
router.get('/myfriend',getFriends);
router.post('/friend-request/:id',sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);


export default router;