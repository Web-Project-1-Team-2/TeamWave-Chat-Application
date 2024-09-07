import {
  Box,
  Button,
  Card,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { boxStyling, styleModal } from "./TeamModalCardStyling";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function TeamModalCard({ open, handleClose, teamMembers, teamChannels, teamId }) {

  const navigate = useNavigate()

  console.log(teamChannels);

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      aria-labelledby="modal-title"
      >
        <Card sx={styleModal }>
          <Stack
           direction="row" 
           justifyContent="space-between"
           >
            <Box >
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

          <Box >
            <Typography variant="h6">Team Members:</Typography>
              <Box
              display="flex"
              flexDirection="column"
              sx={boxStyling}
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
          <Button 
            variant="contained" 
            onClick={()=> navigate(`/teams/${teamId}`)}
            >
            Go to Team Page</Button>
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
    teamChannels:PropTypes.object,
    teamId:PropTypes.string,
};

export default TeamModalCard;
