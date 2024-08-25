import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Modal,
  Typography,
} from "@mui/material";
import { styleModal } from "./TeamModalCardStyling";
import PropTypes from 'prop-types';

function TeamModalCard({ open, handleClose, avatar, teamNames, teamMembers }) {
  return (
    <Modal 
    open={open} 
    onClose={handleClose} 
    aria-labelledby="modal-title">
        <Card sx={styleModal }>
            {console.log(teamNames)}
          <CardHeader>
            <Typography>Hello</Typography>
            avatar ={<Avatar src={avatar} />}
            title = {teamNames}
            sx={{ bgcolor: 'background.default' }}
          </CardHeader>
          <Typography variant="h6">Team Members:</Typography>
          {Object.keys(teamMembers).length > 0 ? (
            <ul>
              {Object.keys(teamMembers).map((memberKey) => (
                <li key={memberKey}>{memberKey}</li>
              ))}
            </ul>
          ) : (
            <Typography>No members found.</Typography>
          )}
        </Card>
    </Modal>
  );
}

TeamModalCard.propTypes = {
    avatar: PropTypes.string,
    teamNames: PropTypes.string,
    teamMembers: PropTypes.object,
    teamChannels:PropTypes.object
    
    
};

export default TeamModalCard;
