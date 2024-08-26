import {
  Box,
  Card,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { styleModal } from "./TeamModalCardStyling";
import PropTypes from 'prop-types';

function TeamModalCard({ open, handleClose, teamMembers, teamChannels }) {


  return (
    <Modal 
    open={open} 
    onClose={handleClose} 
    aria-labelledby="modal-title">
        <Card sx={styleModal }>
          <Stack direction="row" spacing={12}>
            <Box alignItems="flex-start">
                {console.log(teamChannels)}
          <Typography variant="h6">Team channels:</Typography>
          {teamChannels ? (
            <ul>
              {Object.keys(teamChannels).map((channelId) => {
                const channel = teamChannels[channelId];
                return(
                <li key={channel}>{channel.name}</li>
                )
                })}
            </ul>
          ) : (
            <Typography>No channels found</Typography>
          )}
          </Box>

          <Box alignItems="flex-end">
          <Typography variant="h6">Team Members:</Typography>
          <Box
          display="flex"
          flexDirection="column"
          sx={{ height: "150px", overflow: "auto", width: "180px" }}
          >
          {Object.keys(teamMembers).length > 0 ? (
            <ul>
              {Object.keys(teamMembers).map((memberKey) => (
                <li key={memberKey}>{memberKey}</li>
              ))}
            </ul>
          ) : (
            <Typography>No members found.</Typography>
          )}
          </Box>
          </Box>
          </Stack>
        </Card>
    </Modal>
  );
}

TeamModalCard.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    avatar: PropTypes.string,
    teamNames: PropTypes.string,
    teamMembers: PropTypes.object,
    teamChannels:PropTypes.object
};

export default TeamModalCard;
