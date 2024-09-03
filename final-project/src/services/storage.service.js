import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase-config";
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file, uid, username) => {
    const storageRef = ref(storage, `avatars/${username}/${uid}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

export const deleteImage = async (username, uid) => {
    const storageRef = ref(storage, `avatars/${username}/${uid}`);
    await deleteObject(storageRef)
}

export const getAvatar = async (teamId) => {
    const storageRef = ref(storage, `teamAvatars/${teamId}/${teamId}`);
    return getDownloadURL(storageRef);
}

export const uploadTeamAvatar = async (file, teamId, teamName) => {
    const storageRef = ref(storage, `teamAvatars/${teamId}/${teamName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

export const deleteTeamAvatar = async (teamId, teamName) => {
    const storageRef = ref(storage, `teamAvatars/${teamId}/${teamName}`);
    await deleteObject(storageRef)
}


export const uploadChannelImage = async ( file, channelId ) => {
    const uniqueFilename = `${Date.now()}-${uuidv4()}`;
    const storageRef = ref(storage, `channelImages/${channelId}/${uniqueFilename}`);
    await uploadBytes(storageRef, file);
    const channelPhoto = {fileName: uniqueFilename, url: await getDownloadURL(storageRef)};
    return channelPhoto;
}

export const deleteChannelImage = async (channelId, fileName) => {
    const storageRef = ref(storage, `channelImages/${channelId}/${fileName}`);
    await deleteObject(storageRef)
}

export const uploadDirectMessageImage = async (file, directMessageId) => {
    const uniqueFilename = `${Date.now()}-${uuidv4()}`;
    const storageRef = ref(storage, `directMessageImages/${directMessageId}/${uniqueFilename}`);
    await uploadBytes(storageRef, file);
    const directMessagePhoto = {fileName: uniqueFilename, url: await getDownloadURL(storageRef)};
    return directMessagePhoto;
}

export const deleteDirectMessageImage = async (directMessageId, fileName) => {
    const storageRef = ref(storage, `directMessageImages/${directMessageId}/${fileName}`);
    await deleteObject(storageRef)
}