import { get, set, ref, query, equalTo, orderByChild, push, update } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const createTeam = async (teamName, teamMembers, teamOwner) => {
    const newTeam = {
        name: teamName,
        members: { ...teamMembers, [teamOwner]: true, },
        owner: teamOwner,
    };
    const result = await push(ref(db, 'teams'), newTeam);   
    const id = result.key;
    await update(ref(db), {[`teams/${id}/id`]: id,});
}