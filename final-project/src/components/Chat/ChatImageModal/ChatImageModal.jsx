import { Modal } from '@mui/material';
import PropTypes from 'prop-types';
import {chatImageModalImgStyling, chatImageModalStyling } from './chatImageModalStyling';

const ChatImageModal = ({ imageUrl, open, toggleModal }) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={toggleModal}
                sx={chatImageModalStyling}
            >
                <img src={imageUrl} style={chatImageModalImgStyling} />
            </Modal>
        </div>
    )
}

ChatImageModal.propTypes = {
    imageUrl: PropTypes.string,
    open: PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default ChatImageModal
