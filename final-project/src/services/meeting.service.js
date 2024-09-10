import { VIDEO_API_KEY } from "../common/constraints";
import { ref, update } from 'firebase/database';
import { db } from '../config/firebase-config.js';


export const createMeeting = async (chatId) => {
    try {
        const response = await fetch('https://api.daily.co/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.APP_DAILY_API_KEY}`,
            },
            body: JSON.stringify({ properties: { enable_screenshare: true, enable_chat: true } }),
        });

        const room = await response.json();
        const newRoomUrl = room.url;

        // Store room data in Firebase Realtime Database
        const roomId = room.url.split('/').pop(); // Extract room ID from URL

        await update(ref(db, `channels/${chatId}/meetings`), { roomId: roomId, roomUrl: newRoomUrl});

        return newRoomUrl;
    } catch (error) {
        console.log(error);
    }
}

export const createDmMeeting = async (chatId) => {
    try {
        const response = await fetch('https://api.daily.co/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${VIDEO_API_KEY}`,
            },
            body: JSON.stringify({ properties: { enable_screenshare: true, enable_chat: true } }),
        });

        const room = await response.json();
        const newRoomUrl = room.url;

        const roomId = room.url.split('/').pop();

        await update(ref(db, `directMessages/${chatId}/meetings`), { roomId: roomId, roomUrl: newRoomUrl});

        return newRoomUrl;
        
    } catch (error) {
        console.log(error);
        
    }
}