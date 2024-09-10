/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Box, Card, Collapse, Grid, ImageList, ImageListItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import {useEffect, useState } from 'react';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import ChatImageModal from '../ChatImageModal/ChatImageModal';
import { chatDetailMembersStyling } from '../ChatDetailsMembers/ChatDetaileMembersStyling';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const ChatMedia = ({ chatId, chatType }) => {

    const [chatMessages] = useListVals(ref(db, `${chatType}/${chatId}/messages`));

    const [images, setImages] = useState([]);
    

    const [imageModal, setImageModal] = useState(false);
    const toggleImageModal = (imageUrl) => {
        setCurrImageModalUrl(imageUrl);
        setImageModal(!imageModal);
    }
    const [currImageModalUrl, setCurrImageModalUrl] = useState('');

    useEffect(() => {
        if (!chatMessages) return;

        const withImages = chatMessages.filter(message => 'image' in message && 'id' in message);

        setImages(withImages);

    }, [chatMessages]);

    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card sx={chatDetailMembersStyling}>
                <Grid container
                    direction={'row'}
                    justifyContent={'flex-start'}
                    alignItems='center'
                    sx={{ width: '100%', height: '100%' }
                    }>
                    <Grid item xs={10} sx={{ width: '100%' }}>
                        <Typography variant='h6' sx={{ ml: 1 }} >Media</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Grid>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{
                                maxHeight: '150px',
                                overflow: 'auto',
                        }}>
                            <ImageList variant="masonry" cols={3} gap={5}>
                                {images.length > 0 ? images.map( message => (
                                    <ImageListItem key={message.image.fileName}>
                                        <img
                                            onClick={() => toggleImageModal(message.image.url)}
                                            srcSet={`${message.image.url}`}
                                            src={`${message.image.url}`}
                                            alt='image'
                                            loading="lazy"
                                            style={{ cursor: 'pointer', borderRadius: '8px' }}
                                        />
                                    </ImageListItem>
                                )) : <Typography variant='body1'>No images</Typography>}
                            </ImageList>
                        </Box>
                    </Collapse>
                </Grid>
            </Card >
            {imageModal &&
                <ChatImageModal
                    imageUrl={currImageModalUrl}
                    open={imageModal}
                    toggleModal={toggleImageModal} />
            }
        </>
    )
}

ChatMedia.propTypes = {
    chatId: PropTypes.string.isRequired,
    chatType: PropTypes.string.isRequired,
};

export default ChatMedia
