import { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';


const MeetingDm = () => {

    const { meetingId } = useParams();

    const [meetingInfo] = useObjectVal(ref(db, `directMessages/${meetingId}/meetings`));

    const videoRef = useRef(null);
    const callFrame = useRef(null);
    const initialized = useRef(false);

    useEffect(() => {
        console.log("Component mounted");

        if (!meetingInfo) return;

        if (!initialized.current && meetingInfo.roomUrl) {
            callFrame.current = DailyIframe.createFrame(videoRef.current, {
                showLeaveButton: true,
                iframeStyle: {
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                },
            });

            callFrame.current.join({ url: meetingInfo.roomUrl }).catch((error) => {
                console.error("Failed to join call:", error);
            });

            initialized.current = true;
        }

        return () => {
            if (callFrame.current) {
                callFrame.current.leave();
                callFrame.current.destroy();
                callFrame.current = null;
                initialized.current = false;
                console.log("CallFrame destroyed");
                console.log("Component unmounted");
                
            }
        };
    }, [meetingInfo]);

    return (
        <Box sx={{width: '100%', height: '80vh'}}>
            <div ref={videoRef} style={{
                display: "flex",
                justifyContent: "center",  
                alignItems: "center",      
                width: "100%",             
                height: "100%",            
                position: "relative",
            }}></div>
        </Box>
    )
}

export default MeetingDm
