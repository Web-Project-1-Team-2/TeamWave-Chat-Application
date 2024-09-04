/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/authContext"
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import ChannelCard from "../../components/Channel/ChannelCard/ChannelCard";
import DirectMessageCard from "../../components/DirectMessages/DirectMessageCard/DirectMessageCard";

const UserBoard = () => {

    const {userData} = useContext(AppContext);

    const [profile , loadingProfile] = useObjectVal(ref(db, `users/${userData?.username}`));

    const [profileState, setProfileState] = useState({
        avatar: "",
        uid: "",
        username: "",
        firstName: "",
        lastName: "",
        status: "",
    });

    const [channelMessages] = useListVals(ref(db, 'channels'));
    const [unreadChannelMessages, setUnreadChannelMessages] = useState([]);
    
    const [userDirectMessages] = useListVals(ref(db, 'directMessages'));
    const [unreadDirectMessages, setUnreadDirectMessages] = useState([]);

    useEffect(() => {
        if (!profile) return;
        setProfileState({
            ...profile,
            avatar: profile.avatar || "",
            firstName: profile.firstName || "",
            lastName: profile.lastName || "", 
        })
    },[profile])

    useEffect(() => {
        if (!channelMessages || !userData) return;

        const userChannels = channelMessages.filter(channel => channel.members[userData?.username] && 'id' in channel);
        const isUnread = userChannels.filter(channel => {
            if(channel.messages === undefined) return ;

            const lastSeenUser = channel.members[userData?.username].lastAtChannel;
            const channelMessages = Object.values(channel.messages);

            return channelMessages.some(message => message.timestamp > lastSeenUser);
        });

        setUnreadChannelMessages(isUnread);

    }, [channelMessages, !userData]);

    useEffect(() => {
        if (!userData || !userDirectMessages) return;

        const userDms = userDirectMessages.filter(dm => dm.members[userData?.username] && 'id' in dm);
        const isUnread = userDms.filter(dm => {

            if (dm.messages === undefined) return;

            const lastSeenUser = dm.members[userData?.username].lastAtChat;
            const dmMessages = Object.values(dm.messages);

            return dmMessages.some(message => message.timestamp > lastSeenUser);
        });

        setUnreadDirectMessages(isUnread);
    }, [userDirectMessages, userData]);

    console.log(unreadDirectMessages)



    if (loadingProfile) return <div>Loading...</div>

    return (
        <Stack  direction="column" textAlign="center" gap={3}>
            <Typography variant="h3">
                User Board
            </Typography>
            <Stack direction="column" gap={6} alignItems="center" alignContent="center">
                <Box display="flex" textAlign="left" justifyContent="center">
                    
                    <Avatar
                    
                    src={profileState.avatar}
                    sx={{ width: 200, height: 200, zIndex: 1000, position: 'relative' }}
                    >
                        {!profileState.avatar &&
                             (profileState.firstName
                                 ? profileState.firstName[0].toUpperCase() +
                                     profileState.lastName[0].toUpperCase()
                                         : "A")}
                    </Avatar>
                    {profileState.status === "online" &&
                        <Box
                            position={'absolute'}
                            bgcolor={'green'}
                            borderRadius={'50%'}
                            sx={{ zIndex: 1500, width: '40px', height: '40px', right: '630px', bottom: '400px',  border: '2px solid white'}} />
                        }
                </Box>

                <Stack direction="row" gap={12} justifyContent="center">
                        <Stack direction="column" gap={2} alignItems="center"  >
                        <Box
                            width="100%"
                            display="flex"
                            textAlign="center"
                            justifyContent="center"
                        >
                            <Typography variant="h5">Unread Personal Messages:</Typography>
                        </Box>
                        {unreadDirectMessages.length >0 ?
                        <Box
                            display="flex"
                            flexDirection="column"
                            sx={{ height: "400px", overflow: "auto", width: "350px" }}
                        >
                            {unreadDirectMessages.map((message) => (
                            <DirectMessageCard
                                key={message.id}
                                directMessageId={message.id}  
                            />
                            ))}
                        </Box>
                        : 
                        <Typography>You dont have any Personal messages</Typography>
                        }
                        </Stack>

                        <Divider orientation="vertical" 
                        sx={{  
                            height: 200, 
                            bgcolor: 'blue', 
                            borderRadius: 1 
                        }} 
                        ></Divider>

                        <Stack direction="column" gap={2} alignItems="center"  >
                        <Box
                            width="100%"
                            display="flex"
                            textAlign="center"
                            justifyContent="center"
                        >
                            <Typography variant="h5">Unread Channel Messages:</Typography>
                        </Box>
                        { unreadChannelMessages.length > 0 ?
                        <Box
                            display="flex"
                            flexDirection="column"
                            sx={{ height: "400px", overflow: "auto", width: "350px" }}
                        >
                            {unreadChannelMessages.map((channel) => (
                            <ChannelCard
                                key={channel.id}
                                channelName ={channel.name}
                                channelId={channel.id}  
                            />
                            ))}
                        </Box>
                        :
                        <Typography>You don`t have any new messages</Typography>
                        }
                        </Stack>

                </Stack>

            </Stack>
        </Stack>

    )
}


export default UserBoard
