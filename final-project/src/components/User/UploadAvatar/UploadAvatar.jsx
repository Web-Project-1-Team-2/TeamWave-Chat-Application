import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { deleteImage, uploadImage } from "../../../services/storage.service";
import { setImageUrl } from "../../../services/user.service";
import { notifyError, notifySuccess } from "../../../services/notification.service";
import { editTeamAvatarBoxStyle, editTeamAvatarButtonSection, editTeamAvatarStyle } from "../../Teams/EditTeamAvatarModal/EditTeamAvatarStyles";

function UploadAvatar({ open, handleClose, avatar, uid, username }) {

  const [image, setImage] = useState(null);
  const [currImage, setCurrImage] = useState(null);

  const UploadAndSetAvatar = async () => {
    if (!image) return;

    try {
      if (avatar) {
        await deleteImage(username, uid);
      }
      const uploadedImage = await uploadImage(image, uid, username);
      await setImageUrl(username, uploadedImage);
      console.log("sucess")
      notifySuccess("Avatar uploaded successfully.")
      handleClose();
      setCurrImage(null);
      setImage(null);
    } catch (error) {
      console.log(error);
      notifyError("Failed to upload avatar.")
      setImage(null);
      setCurrImage
    }

  };

  const handleChangeAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    setImage(file);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      sx={editTeamAvatarStyle}
    >
      <Box sx={editTeamAvatarBoxStyle}>
        <Typography id="modal-modal-title" variant="h6">
          Change your profile picture
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <Avatar
            src={currImage}
            alt={'new avatar'}
            sx={{ width: 200, height: 200, mr: 2 }}
          />

          <Button variant="contained" component="label" >
            Upload Avatar
            <input type="file" hidden accept="image/*" onChange={handleChangeAvatar} />
          </Button>
        </Box>
        <Box mt={2} sx={editTeamAvatarButtonSection} >
          <Button
            variant="contained"
            color="primary"
            onClick={UploadAndSetAvatar}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

UploadAvatar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  avatar: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default UploadAvatar;
