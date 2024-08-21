import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Box, TextField, Button } from '@mui/material';

const Chat = ({ teamId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const messagesRef = ref(db, `teams/${teamId}/messages`);
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

    const sendMessage = () => {
        if (newMessage.trim()) {
            const messagesRef = ref(db, `teams/${teamId}/messages`);
            push(messagesRef, {
                text: newMessage,
                timestamp: Date.now(),
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                {messages.slice().reverse().map((message) => (
                    <Box key={message.id} sx={{ padding: 1, background: '#f1f1f1', borderRadius: '5px', marginBottom: 1 }}>
                        {message.text}
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ mt: 2, display: 'flex' }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message"
                    onKeyPress={handleKeyPress}
                />
                <Button variant="contained" onClick={sendMessage} sx={{ ml: 1 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;
