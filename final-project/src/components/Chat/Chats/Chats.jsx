/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import ChatBox from "../ChatBox/ChatBox.jsx";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker from "emoji-picker-react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
  Dialog,
  DialogContent,
  Badge,
} from "@mui/material";
import { ref } from "firebase/database";
import { useContext, useEffect, useState, useRef } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { db } from "../../../config/firebase-config";
import { AppContext } from "../../../context/authContext";
import { addMessageToChannel } from "../../../services/channel.service";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { notifyError } from "../../../services/notification.service";
import { chatBoxStyling } from "./chatStyling";
import SendIcon from '@mui/icons-material/Send';

const Chats = ({ id }) => {
  const { userData, themeMode } = useContext(AppContext);

  const [messages] = useListVals(ref(db, `channels/${id}/messages`));
  const [messagesData, setMessagesData] = useState([]);


  const [newMessage, setNewMessage] = useState({
    text: "",
    author: userData?.username,
    image: null,
  });

  const [currImage, setCurrImage] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const handleClickImage = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleRemoveImage = () => {
    setCurrImage(null);
    setNewMessage({ ...newMessage, image: '' });
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    setNewMessage({ ...newMessage, image: file });
  };

  const [emojiPickerState, setEmojiPickerState] = useState(false);
  const toggleEmojiPicker = () => setEmojiPickerState(!emojiPickerState);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (!userData) return;
    setNewMessage({
      ...newMessage,
      author: userData.username,
    });
  }, [userData]);

  useEffect(() => {
    if (!messages) return;
    const correctMessages = messages.filter((message) => "id" in message);
    setMessagesData(correctMessages);
  }, [messages]);

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      scrollToBottom();
    }, 500);

    return () => {
      clearTimeout(scrollTimeout);
    }
  }, [messagesData]);

  const sendMessage = async () => {
    if (newMessage.text.trim().length === 0 && !newMessage.image) {
      notifyError("Message cannot be empty");
      return;
    }

    try {
      await addMessageToChannel(id, newMessage);
      setNewMessage({ ...newMessage, text: "", image: '' });
      setCurrImage(null);
    } catch (error) {
      console.error(error);
      notifyError("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleEmojiClick = (e) => {
    setNewMessage({ ...newMessage, text: newMessage.text + e.emoji });
    toggleEmojiPicker();
  };

  const inputProps = {
    startAdornment: currImage && (
      <InputAdornment position="start">
        <Badge badgeContent={
          <IconButton size="small" onClick={handleRemoveImage}
            sx={{
              fontSize: "10px",
              color: "white",
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
            }}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        ></Badge>
        <img src={currImage} alt="Selected"
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: 4,
            marginRight: 8,
            cursor: "pointer",
          }}
          onClick={handleClickImage}
        />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <IconButton component="label">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImage}
          />
          <ImageIcon />
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <>
      <Box>
        <Box sx={chatBoxStyling}>
          <Grid
            container
            direction={"row-reverse"}
            justifyContent={"flex-end"}
            alignContent={"flex-end"}
            spacing={1}>
            {messagesData.length > 0 ? (
              messagesData.map((message) => {
                return (
                  <Grid
                    container
                    item
                    xs={12}
                    key={message.id}
                    justifyContent={
                      userData?.username === message.author
                        ? "flex-end"
                        : "flex-start"
                    }
                  >
                    <ChatBox
                      text={message.text}
                      username={message.author}
                      timestamp={message.timestamp}
                      isCurrUser={userData?.username === message.author}
                      image={message?.image || null}
                      messageId={message.id}
                      chatId={id}
                    />
                  </Grid>
                );
              })
            ) : (
              <Typography variant="body1">No messages yet</Typography>
            )}
            <div ref={messagesEndRef}></div>
          </Grid>
        </Box>
        <Grid container justifyContent="center" sx={{ gap: 1 }}>
          <Grid item xs={10}>
            <Grid>
              <TextField
                value={newMessage.text}
                onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
                onKeyDown={handleKeyPress}
                label="Type a message"
                sx={{ width: "100%" }}
                InputProps={inputProps}>
                <ImageIcon />
              </TextField>
            </Grid>
          </Grid>

          <Grid
            container
            item
            xs={0.5}
            alignItems={"center"}
            justifyContent={"center"}
            position={"relative"}
          >
            <IconButton onClick={toggleEmojiPicker} sx={{ fontSize: 35 }}>
              <EmojiEmotionsIcon fontSize="inherit" />
            </IconButton>
            <EmojiPicker
              open={emojiPickerState}
              onEmojiClick={handleEmojiClick}
              style={{ position: "absolute", zIndex: 3000, bottom: 60 }}
              theme={themeMode === "light" ? "light" : "dark"}
            />
          </Grid>
          <Grid
            container
            item
            xs={1}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Button
              variant={"contained"}
              size="large"
              onClick={sendMessage}>
              <SendIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent>
          <img
            src={currImage}
            alt="Full size"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

Chats.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Chats;
