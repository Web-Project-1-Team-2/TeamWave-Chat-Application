import { get, ref, update, push, remove } from 'firebase/database';
import { db } from '../config/firebase-config.js';
import { uploadChannelImage } from './storage.service.js';

export const addMemberToChannel = async (channelId, username) => {
    const currMembers = await get(ref(db, `channels/${channelId}/members`));
    await update(ref(db, `channels/${channelId}/members`), { ...currMembers.val(), [username]: true });
}

export const addChannelToMember = async (channelId, username) => {
    const currChannels = await get(ref(db, `users/${username}/channels`));
    await update(ref(db, `users/${username}/channels`), { ...currChannels.val(), [channelId]: true },);
}

export const addChannelToTeam = async (channelId, teamId, channelName) => {
    const teamChannelsRef = ref(db, `teams/${teamId}/channels`);
    const currChannelsSnapshot = await get(teamChannelsRef);
    const currChannels = currChannelsSnapshot.val() || {};
    const updatedChannels = {
        ...currChannels,
        [channelId]: {
            id: channelId,
            name: channelName
        }
    };
    await update(teamChannelsRef, updatedChannels);
};

export const createChannel = async (teamId, channelName, channelMembers, channelCreator) => {
    const members = Object.keys(channelMembers);

    const newChannel = {
        name: channelName,
        members: members.length > 0 ? { ...channelMembers, [channelCreator]: true, } : {[channelCreator]: true, },
        creator: channelCreator,
        teamId: teamId,
    }

    const result = await push(ref(db, `channels`), newChannel);
    const id = result.key;
    await update(ref(db), { [`channels/${id}/id`]: id });
    await addChannelToMember(id, channelCreator);
    await Promise.all(members.map(username => addChannelToMember(id, username)));
    await addChannelToTeam(id, teamId, channelName);
}

export const updateUserLastSentMessage = async (channelId, username, messageId) => {
    const channelMembers = await get(ref(db, `channels/${channelId}/members/${username}`));
    await update(ref(db, `channels/${channelId}/members/${username}`), {...channelMembers.val(), lastSentMessage: messageId});
}

export const addMessageToChannel = async (channelId, message) => {
    const trimmedMessage = message.text.trim();
    
    let imageRef = null;
    if(message.image) {
    imageRef = await uploadChannelImage(message.image, channelId);
    }

    const newMessage = {
        author: message.author,
        text: trimmedMessage,
        image: imageRef || null,
        timestamp: Date.now(),
    }

    const result = await push(ref(db, `channels/${channelId}/messages`), newMessage);
    const id = result.key;
    await update(ref(db), { [`channels/${channelId}/messages/${id}/id`]: id });
    await updateUserLastSentMessage(channelId, message.author, id);
}

export const leaveChannel = async (channelId, username) => {
    const channelMember = ref(db, `channels/${channelId}/members/${username}`);
    const userRef = ref(db, `users/${username}/channels/${channelId}`);
    await remove(channelMember);
    await remove(userRef);
}

export const updateLastSeen = async (channelId, username) => {
    const channelMembers = await get(ref(db, `channels/${channelId}/members/${username}`));
    await update(ref(db, `channels/${channelId}/members/${username}`), {...channelMembers.val(), lastAtChannel: Date.now()});
}

export const editChannelMessage = async (channelId, messageId, newText) => {
    await update(ref(db, `channels/${channelId}/messages/${messageId}`), { text: newText });
}

export const deleteChannelMessage = async (channelId, messageId) => {
    await remove(ref(db, `channels/${channelId}/messages/${messageId}`));
}