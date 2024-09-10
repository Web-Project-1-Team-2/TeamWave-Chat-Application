import { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';


const Meeting = () => {

    const { meetingId } = useParams();

    const [meetingInfo] = useObjectVal(ref(db, `channels/${meetingId}/meetings`));

    const navigate = useNavigate();

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
                    borderRadius: '16px',
                    border: 'none',
                },
                theme: {
                    colors: {
                        accent: '#4672b3',
                        background: '#000f1c',
                        backgroundAccent: '#1b293b',
                        baseText: '#ffffff',
                    },
                },
            });

            callFrame.current.join({ url: meetingInfo.roomUrl }).catch((error) => {
                console.error("Failed to join call:", error);
            });

            initialized.current = true;
        }

        callFrame.current.on('participant-joined', (event) => {
            console.log('New participant joined', event);
        });

        callFrame.current.on('left-meeting', () => {
            setTimeout(() => {
                navigate(-1);
            }, 1000)
        });

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
        <Box sx={{ width: '100%', height: '85vh' }}>
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

export default Meeting
