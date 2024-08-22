import { useState } from "react";
import { deleteFirstName, updateFirstName } from "../../services/user.service";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function UpdateFirstName({ open, handleClose, username, firstName, handleUpdate }) {
  const [newFirstName, setNewFirstName] = useState(null);

  const UpadateNewFirstName = async () => {
    if (!firstName) return;

    try {
      if (firstName !== "") {
        await deleteFirstName(username);
      }
      await updateFirstName(username, newFirstName);
      await(handleUpdate(newFirstName));
      alert("Success");
      handleClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6">
          Change your First Name
        </Typography>
        <TextField
        label = "First Name"
        value={newFirstName}
        onChange={(e) => {setNewFirstName(e.target.value)}}
        />
            <Stack direction="row" spacing={4} mt={3}>
        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={UpadateNewFirstName}
          >
            Save
          </Button>
        </Box>
        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
UpdateFirstName.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    handleUpdate:PropTypes.func.isRequired,
  };
  


export default UpdateFirstName;
