import { get, ref, update, push } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const addMemberToChannel = async (channelId, username) => {
    const currMembers = await get(ref(db, `channels/${channelId}/members`));
    await update(ref(db, `channels/${channelId}/members`), { ...currMembers.val(), [username]: true });
}

export const addChannelToMember = async (channelId, username) => {
    const currChannels = await get(ref(db, `users/${username}/channels`));
    await update(ref(db, `users/${username}/channels`), { ...currChannels.val(), [channelId]: true });
}

export const addChannelToTeam = async (channelId, teamId) => {
    const currChannels = await get(ref(db, `teams/${teamId}/channels`));
    await update(ref(db, `teams/${teamId}/channels`), { ...currChannels.val(), [channelId]: true });
}

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
    await addChannelToTeam(id, teamId);
}

export const addMessageToChannel = async (channelId, message) => {
    const trimmedMessage = message.text.trim();

    const newMessage = {
        author: message.author,
        authorAvatar: message.authorAvatar || '',
        text: trimmedMessage,
        timestamp: Date.now(),
    }

    const result = await push(ref(db, `channels/${channelId}/messages`), newMessage);
    const id = result.key;
    await update(ref(db), { [`channels/${channelId}/messages/${id}/id`]: id });
}