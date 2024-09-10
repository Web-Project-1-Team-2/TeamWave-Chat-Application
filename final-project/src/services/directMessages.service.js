import { get, ref, update, push, remove } from 'firebase/database';
import { db } from '../config/firebase-config.js';
import { uploadDirectMessageImage } from './storage.service.js';

export const addDirectMessageToUser = async (directMessageId, username) => {
    const currDirectMessages = await get(ref(db, `users/${username}/directMessages`));
    await update(ref(db, `users/${username}/directMessages`), { ...currDirectMessages.val(), [directMessageId]: true });
}

export const createNewDirectMessage = async (sender, receiver) => {

    const NewDirectMessage = {
        members: {
            [sender]: {lastAtChat: Date.now()},
            [receiver]: {lastAtChat: Date.now()},
        },
    }

    const result = await push(ref(db, `directMessages`), NewDirectMessage);
    const id = result.key;
    await update(ref(db), { [`directMessages/${id}/id`]: id });
    await addDirectMessageToUser(id, sender);
    await addDirectMessageToUser(id, receiver);
    const directMessage = await get(ref(db, `directMessages/${id}`));
    console.log(directMessage);    
    return directMessage.val();
}

export const updateUserLastSeenDirectMessage = async (directMessageId, username) => {
    const directMessageMembers = await get(ref(db, `directMessages/${directMessageId}/members/${username}`));
    await update(ref(db, `directMessages/${directMessageId}/members/${username}`), { ...directMessageMembers.val(), lastAtChat: Date.now() });
}

export const updateLastSentDirectMessage = async (directMessageId, username, messageId) => {
    const directMessageMembers = await get(ref(db, `directMessages/${directMessageId}/members/${username}`));
    await update(ref(db, `directMessages/${directMessageId}/members/${username}`), { ...directMessageMembers.val(), lastSentMessage: messageId });
}

export const addMessageToDirectMessage = async (directMessageId, message) => {
    const trimmedMessage = message.text.trim();

    let imageRef = null;
    if(message.image) {
    imageRef = await uploadDirectMessageImage(message.image, directMessageId);
    }

    const newMessage = {
        text: trimmedMessage,
        timestamp: Date.now(),
        author: message.author,
        image: imageRef,
    }

    const result = await push(ref(db, `directMessages/${directMessageId}/messages`), newMessage);
    const id = result.key;
    await update(ref(db), { [`directMessages/${directMessageId}/messages/${id}/id`]: id });
    await updateLastSentDirectMessage(directMessageId, message.author, id);
}

export const editDirectMessage = async (directMessageId, messageId, newMessage) => {
    await update(ref(db, `direMessages/${directMessageId}/messages/${messageId}`), { text: newMessage });
}

export const deleteDirectMessage = async (directMessageId, messageId) => {
    await remove(ref(db, `directMessages/${directMessageId}/messages/${messageId}`));
}