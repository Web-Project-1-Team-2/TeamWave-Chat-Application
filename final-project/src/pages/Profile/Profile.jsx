import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Avatar, Box, Typography } from "@mui/material";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";


const Profile = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { userData } = useContext(AppContext);
  const [data, setData] = useState({
    avatar: "",
    uid: "",
    username: "",
  });

  useEffect(() => {
    if (!userData) return;
    setData({
      ...userData,
      avatar: userData.avatar || "",
      username: userData.username || "",
      uid: userData.uid || "",
    });
  }, [userData]);

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center" gap={3}>
      <Typography variant="h2" mb={3}>
        Profile
      </Typography>

      <Box display="flex" alignItems="center" mb={2} gap={3}>
        <Avatar
          src={data.avatar}
          sx={{ width: 100, height: 100, mr: 2, cursor: "pointer" }}
          onClick={handleOpen}
        >
          {!data.avatar &&
            (data.firstName
              ? data.firstName[0].toUpperCase() + data.lastName[0].toUpperCase()
              : "A")}    
        </Avatar>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
      <Typography>Username: {data.username}</Typography>
      <Typography >First Name: {data.firstName}</Typography>
      <Typography >Last Name: {data.lastName}</Typography>
      <Typography >Created on: {data.createdOn}</Typography>
      </Box>
      </Box>
      <UploadAvatar open={open} handleClose={handleClose} avatar={data.avatar} username={data.username} uid ={data.uid}/>
    </Box>
  );
};

export default Profile;

