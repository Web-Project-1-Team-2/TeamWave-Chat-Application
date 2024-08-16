import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const getUserByUsername = async (username) => {
    const snapshot = await get(ref(db, `users/${username}`));
    return snapshot.val();
};

export const createUser = async (firstName, lastName, username, uid, email) => {
    return await set(ref(db, `users/${username}`), 
        { firstName, lastName, username, uid, email, createdOn: new Date().toLocaleDateString(), createdPosts: {}, postCount: 0, level: 'Rookie' }
    );
};

export const getUserData = async (uid) => {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    return snapshot.val(); 
};

export const setImageUrl = async (username, url) => {
    return await set(ref(db, `users/${username}/avatar`), url);
}