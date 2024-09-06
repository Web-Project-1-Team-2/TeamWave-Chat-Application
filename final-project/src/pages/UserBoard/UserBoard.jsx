/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Avatar, Box, Divider, Grid, Typography } from "@mui/material";
import { useListVals } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import UserBoardUnreadDm from "../../components/DirectMessages/UserBoardUnreadDm/UserBoardUnreadDm";
import UserBoardUnreadChannelMessages from "../../components/Channel/UserBoardUnreadChannelMessages/UserBoardUnreadChannelMessages";
import UserBoardNoMessages from "../../components/Base/UserBoardNoMessages/UserBoardNoMessages";

const UserBoard = () => {

  const { userData } = useContext(AppContext);

  const [channelMessages] = useListVals(ref(db, "channels"));
  const [unreadChannelMessages, setUnreadChannelMessages] = useState([]);

  const [userDirectMessages] = useListVals(ref(db, "directMessages"));
  const [unreadDirectMessages, setUnreadDirectMessages] = useState([]);
  console.log(unreadDirectMessages);


  useEffect(() => {
    if (!channelMessages || !userData) return;

    const unreadChannelMessages = channelMessages.reduce((acc, channel) => {

      if (!(userData.username in channel.members)) return acc;
      if (channel.messages === undefined) return acc;

      const userLastAtChannel = channel.members[userData.username]?.lastAtChannel ? channel.members[userData.username].lastAtChannel : 0;
      if (userLastAtChannel === 0) return acc;

      const channelMessages = Object.values(channel.messages);
      const unreadMessages = channelMessages.map(message => {
        if (message.timestamp > userLastAtChannel) {
          message.channelId = channel.id;
          acc.push(message);
        }
      });
      return acc
    }, [])

    if (unreadChannelMessages.length > 0) {
      setUnreadChannelMessages(unreadChannelMessages.sort((a, b) => b.timestamp - a.timestamp));
    }

  }, [channelMessages, userData])

  useEffect(() => {
    if (!channelMessages || !userData) return;

    const unreadDirectMessages = userDirectMessages.reduce((acc, dm) => {
      if (!(userData.username in dm.members)) return acc;
      if (dm.messages === undefined) return acc;

      const userLastAtDm = dm.members[userData.username]?.lastAtChat ? dm.members[userData.username].lastAtChat : 0;
      if (userLastAtDm === 0) return acc;

      const dmMessages = Object.values(dm.messages);
      const unreadMessages = dmMessages.map(message => {
        if (message.timestamp > userLastAtDm) {
          message.dmId = dm.id;
          acc.push(message);
        }
      });

      return acc;
    }, [])

    if (unreadDirectMessages.length > 0) {
      setUnreadDirectMessages(unreadDirectMessages.sort((a, b) => b.timestamp - a.timestamp));
    }

  }, [userDirectMessages, userData])

  return (
    <Box sx={{
      display: "flex",
      flexDirection: 'column',
      alignItems: 'center',
      gap: 5,
      width: "100%",
    }}>

      <Divider variant="middle" textAlign="left" flexItem>
        <Typography variant="h2">User Board</Typography>
      </Divider>

      <Box sx={{
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
      }}>
        <Avatar
          src={userData?.avatar}
          sx={{
            width: 180,
            height: 180,
            mr: 2,
            border: 5,
            borderColor: 'primary.main',
          }}
        >
          {!userData?.avatar &&
            (userData?.firstName
              ? userData?.firstName[0].toUpperCase() +
              userData?.lastName[0].toUpperCase()
              : "A")}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
          <Typography variant="h3">{userData?.username}</Typography>
          <Typography variant="h5">{`${userData?.firstName} ${userData?.lastName}`}</Typography>
        </Box>
      </Box>

      {unreadDirectMessages.length > 0 &&
        <Grid container
          direction={'column'}
          alignItems={'center'}
          sx={{
            bgcolor: 'background.paper',
            width: '80%',
            borderRadius: 2,
            p: 2,
            gap: 2,
          }}>
          <Typography variant="h6" alignSelf={'flex-start'}>Recent Unread Direct Messages</Typography>

          {unreadDirectMessages.map(dm => (
            <UserBoardUnreadDm key={dm.id} author={dm.author} text={dm.text} chatId={dm.dmId} />
          ))}
        </Grid>
      }

      {unreadChannelMessages.length > 0 &&
        <Grid container
          direction={'column'}
          alignItems={'center'}
          sx={{
            bgcolor: 'background.paper',
            width: '80%',
            borderRadius: 2,
            p: 2,
            gap: 2,
          }}>
          <Typography variant="h6" alignSelf={'flex-start'}>Recent Unread Channel Messages</Typography>

          {unreadChannelMessages.map(channelMessage => (
            <UserBoardUnreadChannelMessages key={channelMessage.id} author={channelMessage.author} text={channelMessage.text} chatId={channelMessage.channelId} />
          ))}
        </Grid>
      }

      {(unreadDirectMessages.length === 0 && unreadChannelMessages.length === 0) &&
        <UserBoardNoMessages />
      }


    </Box>
  );
};

export default UserBoard;

{/* <Stack direction="column" textAlign="center" gap={3} sx={{width: '100%'}}>

<Stack
  direction="column"
  gap={6}
  alignItems="center"
  alignContent="center"
>
  

  <Stack direction="row" gap={12} justifyContent="center">
    <Stack direction="column" gap={2} alignItems="center">
      <Box
        width="100%"
        display="flex"
        textAlign="center"
        justifyContent="center"
      >
        <Typography variant="h5">Unread Personal Messages:</Typography>
      </Box>
      {unreadDirectMessages.length > 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          sx={unreadBoxStyle}
        >
          {unreadDirectMessages.map((message) => (
            <DirectMessageCard
              key={message.id}
              directMessageId={message.id}
            />
          ))}
        </Box>
      ) : (
        <Typography>You dont have any Personal messages</Typography>
      )}
    </Stack>

    <Box display="flex" alignItems="center">
      <Divider orientation="vertical"  sx={{ height: '70%', borderRightWidth: 2 }}/>
    </Box>

    <Stack direction="column" gap={2} alignItems="center">
      <Box
        width="100%"
        display="flex"
        textAlign="center"
        justifyContent="center"
      >
        <Typography variant="h5">Unread Channel Messages:</Typography>
      </Box>
      {unreadChannelMessages.length > 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          sx={unreadBoxStyle}
        >
          {unreadChannelMessages.map((channel) => (
            <ChannelCard
              key={channel.id}
              channelName={channel.name}
              channelId={channel.id}
            />
          ))}
        </Box>
      ) : (
        <Typography>You don`t have any new messages</Typography>
      )}
    </Stack>
  </Stack>
</Stack>
</Stack> */}