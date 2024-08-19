import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';

const TeamPage = () => {
    const { teamId } = useParams();
    const [teamData, setTeamData] = useState(null);

    useEffect(() => {
        const teamRef = ref(db, `teams/${teamId}`);
        const unsubscribe = onValue(teamRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTeamData(data);
            }
        });

        return () => unsubscribe();
    }, [teamId]);

    if (!teamData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{teamData.name}</h1>
            {/* Here should be the voice/video chat and live chat */}
        </div>
    );
};

export default TeamPage;