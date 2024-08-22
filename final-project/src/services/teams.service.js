import { get, ref,  push, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const addTeamToUser = async (username, teamId) => {
    const currTeams = await get(ref(db, `users/${username}/teams`));
    if(teamId in currTeams.val()) return;
    console.log(currTeams.val());
    await update(ref(db, `users/${username}/teams`), {...currTeams.val(), [teamId]: true,} );
}

export const addUsersToTeam = async (teamId, username) => {
    const currMembers = await get(ref(db, `teams/${teamId}/members`));
    console.log(currMembers.val());
    await update(ref(db, `teams/${teamId}/members`), {...currMembers.val(), [username]: true,} );
};

export const createTeam = async (teamName, teamMembers, teamOwner, teamAvatar) => {
    const usernames = Object.keys(teamMembers)
    const newTeam = {
        name: teamName,
        members: usernames.length > 0 ? { ...teamMembers, [teamOwner]: true, } : {[teamOwner]: true, },
        owner: teamOwner,
        avatar: teamAvatar,
    };
    const result = await push(ref(db, 'teams'), newTeam);
    const id = result.key;
    await update(ref(db), { [`teams/${id}/id`]: id, });
    await addTeamToUser(teamOwner, id);
    await Promise.all(usernames.map(username => addTeamToUser(username, id)));
}

export const deleteTeamMember = async (memberName, teamId) => {
    const teamMember = ref(db, `teams/${teamId}/members/${memberName}`);
    const memberRef = ref(db, `users/${memberName}/teams/${teamId}`);
    await remove(teamMember);
    await remove(memberRef);
};