import { useState, useEffect, useRef, useContext } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { Box, TextField, Button, Avatar } from '@mui/material';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../context/authContext';

const ChatPage = ({ teamId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { userData } = useContext(AppContext);
    const [teamMembers, setTeamMembers] = useState({});

    useEffect(() => {
        const messagesRef = ref(db, `chats/${teamId}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messagesArray = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
                setMessages(messagesArray);
            }
        });
        return () => unsubscribe();
    }, [teamId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const teamMembersRef = ref(db, `teams/${teamId}/members`);
        const unsubscribe = onValue(teamMembersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTeamMembers(data);
            }
        });
        return () => unsubscribe();
    }, [teamId]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            const messagesRef = ref(db, `chats/${teamId}/messages`);
            push(messagesRef, {
                text: newMessage,
                timestamp: Date.now(),
                userId: userData.uid,
                avatar: userData.avatar,
            });
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 2, backgroundColor: '#f0f0f0' }}>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    backgroundColor: '#ffffff', // White background for the chat box
                    borderRadius: 2, // Rounded corners
                    padding: 2, // Padding inside the chat box
                    boxShadow: 1, // Subtle shadow for depth
                    maxWidth: '800px', // Limit the width of the chat box
                    width: '100%', // Ensure it takes full width within max-width
                    margin: '0 auto', // Center the box horizontally
                }}
            >
                {messages.slice().reverse().map((message) => (
                    <Box
                        key={message.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            marginBottom: 2,
                            justifyContent: message.userId === userData.uid ? 'flex-end' : 'flex-start',
                        }}
                    >
                        {message.userId !== userData.uid && (
                            <Avatar
                                alt="Sender Avatar"
                                src={message.avatar}
                                sx={{
                                    width: 40,
                                    height: '100%',
                                    marginRight: 1,
                                    borderRadius: 2,
                                }}
                            />
                        )}
                        <Box
                            sx={{
                                padding: 1,
                                background: message.userId === userData.uid ? '#7e57c2' : '#f1f1f1', // Purple for your messages grey for others
                                borderRadius: 2,
                                maxWidth: '75%', // Restrict message width
                                wordWrap: 'break-word', // Wrap long words to prevent overflow
                                color: message.userId === userData.uid ? '#fff' : '#333', // White text for your messages black for others
                            }}
                        >
                            {message.text}
                        </Box>
                        {message.userId === userData.uid && (
                            <Avatar
                                alt="Sender Avatar"
                                src={message.avatar}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    marginLeft: 1,
                                    borderRadius: 2,
                                }}
                            />
                        )}
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message"
                    onKeyDown={handleKeyPress}
                />
                <Button variant="contained" onClick={sendMessage} sx={{ ml: 1 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPage;
