import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase-config";

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
