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