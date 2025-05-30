// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//     senderID: {type: mongoose.Schema.Types.ObjectId, ref:"Message", required: true },
//     receiverID: {type: mongoose.Schema.Types.ObjectId, ref:"Message", required: true },
//     text: {type: String, },
//     image: {type: String, },
//     seen: {type: Boolean, default: false}
// }, {timestamps: true})


// const Message = mongoose.model("Message", messageSchema);


// export default Message;



import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    text: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
