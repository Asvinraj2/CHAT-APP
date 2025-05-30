import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios, authUser } = useContext(AuthContext); // Added authUser

    // functions to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to get users");
        }
    };

    // function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const res = await axios.get(`/api/messages/${userId}`);
            if (res.data.success) {
                // Convert field names for frontend consistency
                const convertedMessages = res.data.messages.map(msg => ({
                    ...msg,
                    senderID: msg.senderId,
                    receiverID: msg.receiverId
                }));
                setMessages(convertedMessages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fixed and consolidated send message function
    const sendMessages = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                // Convert senderId to senderID for frontend consistency
                const newMessage = {
                    ...data.newMessage,
                    senderID: data.newMessage.senderId,
                    receiverID: data.newMessage.receiverId
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // function to subscribe to messages for selected user
    const subscribeToMessages = () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            // Convert field names for frontend consistency
            const normalizedMessage = {
                ...newMessage,
                senderID: newMessage.senderId,
                receiverID: newMessage.receiverId
            };

            if (selectedUser && normalizedMessage.senderID === selectedUser._id) {
                normalizedMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, normalizedMessage]);
                axios.put(`/api/messages/mark/${normalizedMessage._id}`);
            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [normalizedMessage.senderID]: (prev[normalizedMessage.senderID] || 0) + 1
                }));
            }
        });
    };

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    };

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessages,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};