import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { ref } from 'firebase/database';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState, useRef } from 'react';
import { useListVals } from 'react-firebase-hooks/database';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../context/authContext';
import { addMessageToChannel } from '../../services/channel.service';
import ChatBox from '../ChatBox/ChatBox';

const Chats = ({ id }) => {

    const { userData } = useContext(AppContext);

    const [messages, loading] = useListVals(ref(db, `channels/${id}/messages`));
    const [messagesData, setMessagesData] = useState([]);

    const [newMessage, setNewMessage] = useState({
        text: '',
        author: userData.username,
        authorAvatar: userData.avatar,

    });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (!userData) return;
        setNewMessage({ ...newMessage, author: userData.username, authorAvatar: userData.avatar });
    }, [userData])

    useEffect(() => {
        if (!messages) return;
        const correctMessages = messages.filter(message => 'id' in message);
        setMessagesData(correctMessages);
    }, [messages])

    useEffect(() => {
        const scrollTimeout = setTimeout(() => {
            scrollToBottom();
        }, 100);

        return () => clearTimeout(scrollTimeout);
    }, []);

    const sendMessage = async () => {
        if (newMessage.text.trim().length === 0) {
            alert('Message cannot be empty');
        }

        try {
            await addMessageToChannel(id, newMessage);
            setNewMessage({ ...newMessage, text: '' });
        } catch (error) {
            console.error(error);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <Box
                ref={messagesEndRef}
                sx={{
                    height: '65vh',
                    margin: '16px 0',
                    width: '95%',
                    overflowY: 'auto',
                    wordWrap: 'break-word',
                    border: '2px solid black',
                    borderRadius: '5px',
                }}>
                <Grid container
                    direction={'row-reverse'}
                    justifyContent={'flex-end'}
                    alignContent={'flex-end'}
                    spacing={1}
                    >
                    {messagesData.length > 0 ? messagesData.map(message => {
                        return (
                            <Grid container item xs={12} key={message.id} justifyContent={userData.username === message.author ? 'flex-end' : 'flex-start'}>
                                <ChatBox
                                    text={message.text}
                                    avatar={message.authorAvatar}
                                    username={message.author}
                                    timestamp={message.timestamp}
                                    isCurrUser={userData.username === message.author}
                                />
                            </Grid>
                        )
                    }) : <Typography variant='body1'>No messages yet</Typography>}
                </Grid>
            </Box>
            <Grid container justifyContent='center' spacing={2}>
                <Grid item xs={10}>
                    <TextField
                        value={newMessage.text}
                        onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
                        onKeyDown={handleKeyPress}
                        label='Type a message'
                        sx={{ width: '100%' }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button variant={'contained'} onClick={sendMessage}>Send</Button>
                </Grid>
            </Grid>
        </Box>

    )
}

Chats.propTypes = {
    id: PropTypes.string.isRequired
};

export default Chats
