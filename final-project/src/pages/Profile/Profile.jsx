import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Avatar, Box, Typography } from "@mui/material";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import UpdateFirstName from "../../components/UpdateFirstName/UpdateFirstName";


const Profile = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openFirstName, setOpenFirstName] = useState(false);
  const handleOpenFirstName = () => setOpenFirstName(true);
  const handleCloseFirstName = () => setOpenFirstName(false);

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

  const handleFirstNameUpdate = (newFirstName) => {
    setData((prevData) => ({
      ...prevData,
      firstName: newFirstName,
    }));
  };

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
      <Typography sx={{cursor: "pointer", textDecoration: "underline"}} onClick={handleOpenFirstName}>First Name: {data.firstName}</Typography>
      <Typography >Last Name: {data.lastName}</Typography>
      <Typography >Created on: {data.createdOn}</Typography>
      </Box>
      </Box>
      <UploadAvatar 
      open={open} 
      handleClose={handleClose} 
      avatar={data.avatar} 
      username={data.username} 
      uid ={data.uid}/>
      <UpdateFirstName 
      open={openFirstName} 
      handleClose={handleCloseFirstName}
      username={data.username}
      firstName={data.firstName}
      handleUpdate = {handleFirstNameUpdate}  
      />
    </Box>
  );
};

export default Profile;

