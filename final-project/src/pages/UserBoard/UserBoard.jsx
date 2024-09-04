import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/authContext"
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import ChannelCard from "../../components/Channel/ChannelCard/ChannelCard";

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
    const [unreadDirectMessages, setUnreadDirectMessages] = useState(false);

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
            if(channel.messages === undefined) return false;

            const lastSeenUser = channel.members[userData?.username].lastAtChannel;
            const channelMessages = Object.values(channel.messages);

            return channelMessages.filter(message => message.timestampt > lastSeenUser);
        });

        setUnreadChannelMessages(isUnread);

    }, [channelMessages, userData]);

    console.log(unreadChannelMessages)

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
                            <Box>
                                <Typography>
                                    Unread messages in channels

                                </Typography>
                            </Box>
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
                        </Stack>

                </Stack>

            </Stack>
        </Stack>

    )
}


export default UserBoard
