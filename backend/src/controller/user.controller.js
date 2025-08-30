import { FriendRequest } from "../models/friendReq.model.js";
import { User } from "../models/User.model.js";


export async function getRecommandUser(req,resp) {
    try {
        const user = req.user;

        const recommandUser = await User.find({
            $and: [
                { _id : {$ne: user._id} },
                { _id : {$nin : user.friends} },
                { isOnBoarded: true}
            ]
        });
        return resp.status(200).json(recommandUser)
    } catch (error) {
        console.log('getRecommandUser Error',error);
        return resp.status(500).json({ message: 'Server Error To Get List' })
    }
};

export async function getFriends(req,resp) {
    try {
        const user = await User.findById(req.user._id)
                    .select('friends').populate('friends',"fullname bio nativeLanguage learningLanguage profilePics");

        resp.status(200).json(user.friends)

    } catch (error) {
        console.log('getFriends Error',error);
        return resp.status(500).json({ message: 'Internal Server Error' })
    }
};

export async function sendFriendRequest(req,resp) {
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) {
            return resp.status(400).json({ message: " You can't be send request to yourself" }) 
        };

        const recipient = await User.findById(recipientId);

        if (!recipient) {
            return resp.status(400).json({ message: " Recipient Not Found " }) 
        };

        if (recipient.friends.includes(myId)) {
            return resp.status(400).json({ message: " You are already friend's " }) 
        };

        const existingRequest = await FriendRequest.findOne({
            $or : [
                { sender: myId, recipient:recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if (existingRequest) {
            return resp.status(400).json({ message: "The user Friend request already exist" }) 
        };

        const friendReq = await FriendRequest.create({
            sender : myId,
            recipient: recipientId
        })

        resp.status(201).json(friendReq)
    } catch (error) {
        console.log('sendFriendRequest Error',error);
        return resp.status(500).json({ message: 'Internal Server Error' })
    }
};

export async function acceptFriendRequest(req,resp) {
    try {
        const { id : requestId } = req.params;

        const friendReq = await FriendRequest.findById(requestId);

        if (!friendReq) {
            return resp.status(404).json({ message: "Friend request not Found" })
        };

        if (friendReq.recipient.toString() !== req.user.id) {
            return resp.status(403).json({ message: "You are not authorized to accept this request" });
        };

        friendReq.status = "accepted";
        await friendReq.save();

        await User.findByIdAndUpdate(friendReq.sender, {
            $addToSet: { friends: friendReq.recipient },
          });
      
          await User.findByIdAndUpdate(friendReq.recipient, {
            $addToSet: { friends: friendReq.sender },
          });
      
          resp.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        resp.status(500).json({ message: "Internal Server Error" });
    }
};

export async function getFriendRequests(req, res) {
    try {
      const incomingReqs = await FriendRequest.find({
        recipient: req.user.id,
        status: "pending",
      }).populate("sender", "fullname profilePics nativeLanguage learningLanguage");
  
      const acceptedReqs = await FriendRequest.find({
        sender: req.user.id,
        status: "accepted",
      }).populate("recipient", "fullName profilePic");
  
      res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
      console.log("Error in getPendingFriendRequests controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function getOutgoingFriendReqs(req, res) {
    try {
      const outgoingRequests = await FriendRequest.find({
        sender: req.user.id,
        status: "pending",
      }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
  
      res.status(200).json(outgoingRequests);
    } catch (error) {
      console.log("Error in getOutgoingFriendReqs controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};
