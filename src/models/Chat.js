import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        // name: {type:String, required:true},
        userId: String,
        name: { type: String, default: "" },      // user-set name
        autoName: { type: String, default: "" },  // AI-generated title
        messages: [
            {
                role:{type:String, required:true},
                content:{type:String, required:true},
                timestamp:{type:Number, required:true},
            },
        ],
        userId: {type:String, required:true},
    },
    {timestamps:true}
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;