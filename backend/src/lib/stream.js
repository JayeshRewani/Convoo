import { StreamChat } from "stream-chat";
import "dotenv/config";

const Api_key = process.env.STREAM_API;
const Api_secret = process.env.STREAM_SECRET;

if(!Api_key || !Api_secret){
    console.error('Stream API Key And Secret Is Missing')
};

const streamClient = StreamChat.getInstance(Api_key,Api_secret);

export const upsertStreamuser = async (userdata) => {
    try {
        await streamClient.upsertUsers([userdata]);
        return userdata
    } catch (error) {
        console.error('Error upserting Stream user',error)
    }
};

export const generateStreamToken = async (userId) => {
    // console.log(userId);
    
    try {
        const userIdStr = userId.toString();
        // console.log(userIdStr);
        
        const client = streamClient.createToken(userIdStr);
        // console.log(client);
        
        return client
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
}