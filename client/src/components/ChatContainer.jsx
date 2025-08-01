import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formateMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
    const { messages, selectedUser, setSelectedUser, sendMessages, getMessages } = useContext(ChatContext)
    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()
    const chatContainerRef = useRef()
    const [input, setInput] = useState('');
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const prevMessagesLength = useRef(0);
    const isInitialLoad = useRef(true);

    // handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return null;
        await sendMessages({ text: input.trim() });
        setInput("")
        setIsAutoScrollEnabled(true);
    }

    // handle sending an image
    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Select an image file")
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessages({ image: reader.result })
            e.target.value = ""
            setIsAutoScrollEnabled(true);
        }
        reader.readAsDataURL(file)
    }

    // Check scroll position
    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // If user scrolls up more than 100px from bottom, disable auto-scroll
            const threshold = 100;
            const isNearBottom = scrollHeight - scrollTop <= clientHeight + threshold;
            setIsAutoScrollEnabled(isNearBottom);
        }
    };

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
            setIsAutoScrollEnabled(true);
            isInitialLoad.current = true;
        }
    }, [selectedUser, getMessages])

    useEffect(() => {
        if (messages && scrollEnd.current) {
            // On initial load, always scroll to bottom
            if (isInitialLoad.current) {
                scrollEnd.current.scrollIntoView();
                isInitialLoad.current = false;
                return;
            }

            // Only auto-scroll if:
            // 1. Auto-scroll is enabled (user is near bottom), AND
            // 2. New messages were added
            if (isAutoScrollEnabled && messages.length > prevMessagesLength.current) {
                scrollEnd.current.scrollIntoView({ behavior: "smooth" });
            }

            prevMessagesLength.current = messages.length;
        }
    }, [messages, isAutoScrollEnabled]);

    return selectedUser ? (
        <div className='h-full overflow-hidden relative backdrop-blur-lg'>
            {/* ---------------header------------------- */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500' >
                <img src={selectedUser.profilePic || assets.avatar_icon} alt='' className='w-8 rounded-full' />
                <p className='flex-1 text-lg text-white flex items-center gap-2' >
                    {selectedUser.fullName}
                    {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500' ></span>}
                </p>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt='' className='md:hidden max-w-7' />
                <img src={assets.help_icon} alt='' className='max-md:hidden max-w-5' />
            </div>

            {/* -----------------chat area--------------------- */}
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className='flex flex-col h-[calc(100%-120px)] overflow-y-auto p-3 pb-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
            >
                {messages && messages.length > 0 ? messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'} `}>
                        {msg.image ? (
                            <img src={msg.image} alt='' className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
                        ) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'} `}>
                                {msg.text}
                            </p>
                        )}
                        <div className='text-center text-xs'>
                            <img src={msg.senderID === authUser._id ? (authUser.profilePic || assets.avatar_icon) : (selectedUser?.profilePic || assets.avatar_icon)} alt='' className='w-7 rounded-full' />
                            <p className='text-gray-500' >{formateMessageTime(msg.createdAt)}</p>
                        </div>
                    </div>
                )) : (
                    <div className='flex items-center justify-center h-full text-gray-400'>
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                )}
                <div ref={scrollEnd}></div>
            </div>

            {/* ------------------------bottom area--------------------- */}
            <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
                        type='text'
                        placeholder='Send a message'
                        className='flex-1 text-sm p-3 border-none rounded-lg outline-none bg-transparent text-white placeholder-gray-400'
                    />
                    <input onChange={handleSendImage} type='file' id='image' accept='image/png, image/jpeg' hidden />
                    <label htmlFor='image' >
                        <img src={assets.gallery_icon} alt='' className='w-5 mr-2 cursor-pointer' />
                    </label>
                </div>
                <img onClick={handleSendMessage} src={assets.send_button} alt='' className='w-7 cursor-pointer' />
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'  >
            <img src={assets.logo_icon} className='max-w-16' alt='' />
            <p className='text-lg font-medium text-white' >Chat anytime, anywhere</p>
        </div>
    )
}

export default ChatContainer