// import { ref, set, push, onValue, query, orderByChild, equalTo } from 'firebase/db';
// import { db, auth } from '../config/firebase-config';

// // Create a team
// const createTeam = async (teamName) => {
//     const user = auth.currentUser;
//     const newTeamRef = push(ref(db, 'teams'));
//     await set(newTeamRef, {
//         name: teamName,
//         owner: user.uid,
//         members: {
//             [user.uid]: true
//         }
//     });
// };

// // Fetch teams for a user
// const fetchTeams = (userId) => {
//     const teamsRef = ref(db, 'teams');
//     const userTeamsQuery = query(teamsRef, orderByChild(`members/${userId}`), equalTo(true));
//     onValue(userTeamsQuery, (snapshot) => {
//         const teams = [];
//         snapshot.forEach((childSnapshot) => {
//             teams.push({ id: childSnapshot.key, ...childSnapshot.val() });
//         });
//         // Update state with teams
//     });
// };

// // Add a member to a team
// const addMemberToTeam = async (teamId, memberEmail) => {
//     // First, find the user by email
//     const usersRef = ref(db, 'users');
//     const userQuery = query(usersRef, orderByChild('email'), equalTo(memberEmail));
//     onValue(userQuery, async (snapshot) => {
//         if (snapshot.exists()) {
//             const userData = Object.entries(snapshot.val())[0];
//             const userId = userData[0];
//             await set(ref(db, `teams/${teamId}/members/${userId}`), true);
//         } else {
//             // Handle user not found
//         }
//     }, { onlyOnce: true });
// };

// export { createTeam, fetchTeams, addMemberToTeam };

import React, { useState, useEffect } from 'react';
import { ref, set, push, onValue, query, orderByChild, equalTo, remove } from 'firebase/database';
import { db, auth } from '../../config/firebase-config';

const TeamManagement = () => {
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            fetchTeams(user.uid);
        }
    }, []);

    const createTeam = async (e) => {
        e.preventDefault();
        if (newTeamName.length < 3 || newTeamName.length > 40) {
            setError('Team name must be between 3 and 40 characters');
            return;
        }

        try {
            const user = auth.currentUser;
            const newTeamRef = push(ref(db, 'teams'));
            await set(newTeamRef, {
                name: newTeamName,
                owner: user.uid,
                members: {
                    [user.uid]: true
                }
            });
            setNewTeamName('');
            setError('');
        } catch (error) {
            setError('Error creating team: ' + error.message);
        }
    };

    const fetchTeams = (userId) => {
        const teamsRef = ref(db, 'teams');
        const userTeamsQuery = query(teamsRef, orderByChild(`members/${userId}`), equalTo(true));
        onValue(userTeamsQuery, (snapshot) => {
            const teamsArray = [];
            snapshot.forEach((childSnapshot) => {
                teamsArray.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
            setTeams(teamsArray);
        });
    };

    const addMemberToTeam = async (e) => {
        e.preventDefault();
        if (!selectedTeam) {
            setError('Please select a team first');
            return;
        }

        try {
            const usersRef = ref(db, 'users');
            const userQuery = query(usersRef, orderByChild('email'), equalTo(newMemberEmail));
            onValue(userQuery, async (snapshot) => {
                if (snapshot.exists()) {
                    const userData = Object.entries(snapshot.val())[0];
                    const userId = userData[0];
                    await set(ref(db, `teams/${selectedTeam.id}/members/${userId}`), true);
                    setNewMemberEmail('');
                    setError('');
                } else {
                    setError('User not found');
                }
            }, { onlyOnce: true });
        } catch (error) {
            setError('Error adding member: ' + error.message);
        }
    };

    const removeMemberFromTeam = async (teamId, memberId) => {
        try {
            await remove(ref(db, `teams/${teamId}/members/${memberId}`));
        } catch (error) {
            setError('Error removing member: ' + error.message);
        }
    };

    const deleteTeam = async (teamId) => {
        try {
            await remove(ref(db, `teams/${teamId}`));
        } catch (error) {
            setError('Error deleting team: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Team Management</h2>
            <form onSubmit={createTeam}>
                <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="New Team Name"
                    required
                />
                <button type="submit">Create Team</button>
            </form>

            <h3>Your Teams:</h3>
            <ul>
                {teams.map(team => (
                    <li key={team.id}>
                        {team.name}
                        <button onClick={() => setSelectedTeam(team)}>Manage</button>
                        {team.owner === auth.currentUser.uid && (
                            <button onClick={() => deleteTeam(team.id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>

            {selectedTeam && (
                <div>
                    <h3>Manage {selectedTeam.name}</h3>
                    <form onSubmit={addMemberToTeam}>
                        <input
                            type="email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            placeholder="New Member Email"
                            required
                        />
                        <button type="submit">Add Member</button>
                    </form>
                    <h4>Team Members:</h4>
                    <ul>
                        {Object.keys(selectedTeam.members).map(memberId => (
                            <li key={memberId}>
                                {memberId}
                                {selectedTeam.owner === auth.currentUser.uid && memberId !== auth.currentUser.uid && (
                                    <button onClick={() => removeMemberFromTeam(selectedTeam.id, memberId)}>Remove</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TeamManagement;