/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';
import { onChildAdded, ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { notifyChannelMessage, notifyDirectMessage } from '../../services/notification.service';
import DirectMessageNotification from '../DirectMessages/DirectMessageNotification/DirectMessageNotification';
import { useObjectVal } from 'react-firebase-hooks/database';
import ChannelMessageNotification from '../Channel/ChannelMessageNotification/ChannelMessageNotification';
import { useLocation } from 'react-router-dom';

const NotificationContainer = () => {

    const { userData } = useContext(AppContext);

    const location = useLocation();
    const currLocation = location.pathname.split('/');
    const currLocationId = currLocation[currLocation.length - 1];


    const [dmIds, setDmIds] = useState([]);
    const [channelIds, setChannelIds] = useState([]);

    const [lastDirectMessageTimestamp, setLastDirectMessageTimestamp] = useState(Date.now());
    const [lastChannelMessageTimestamp, setLastChannelMessageTimestamp] = useState(Date.now());


    const [users] = useObjectVal(ref(db, 'users'));
    const [channels] = useObjectVal(ref(db, 'channels'));




    // Channel Notifications
    useEffect(() => {
        if (!userData) return;

        const channelRef = ref(db, 'channels');
        return onChildAdded(channelRef, (snapshot) => {
            const channelId = snapshot.key;

            const isChannelIdIn = channelIds.some(channel => channel.channelId === channelId);

            if (!isChannelIdIn) {
                setChannelIds(prevState => [...prevState, { channelId, snapshot }]);
            }
        });
    }, [userData]);

    useEffect(() => {
        const unsubscribes = channelIds.map(({ channelId, snapshot }) => {
            const channelMessagesRef = ref(db, `channels/${channelId}/messages`);

            return onChildAdded(channelMessagesRef, (messageSnapshot) => {
                const newChannelMessage = messageSnapshot.val();

                if (newChannelMessage.timestamp > lastChannelMessageTimestamp) {
                    const channelMembers = snapshot.child('members').val();
                    if (userData.username in channelMembers && userData.username !== newChannelMessage.author && channelId !== currLocationId) {
                        const currChannel = channels[channelId];
                        notifyChannelMessage(
                            <ChannelMessageNotification
                                author={newChannelMessage.author}
                                channelName={currChannel.name}
                                text={newChannelMessage.text}
                                channelId={channelId}
                            />
                        )
                    }
                    setLastChannelMessageTimestamp(newChannelMessage.timestamp);
                }
            });
        })

        return () => unsubscribes.forEach(unsubscribe => unsubscribe());


    }, [channelIds]);



    // Direct Messages Notifications
    useEffect(() => {
        if (!userData) return;

        const directMessagesRef = ref(db, 'directMessages');

        return onChildAdded(directMessagesRef, (snapshot) => {
            const dmId = snapshot.key;

            const isDmIdIn = dmIds.some(dm => dm.dmId === dmId);
            console.log(isDmIdIn);

            if (!isDmIdIn) {
                setDmIds(prevState => [...prevState, { dmId, snapshot }]);
            }
        });

    }, [userData]);

    useEffect(() => {
        const unsubscribes = dmIds.map(({ dmId, snapshot }) => {
            const messagesRef = ref(db, `directMessages/${dmId}/messages`);

            return onChildAdded(messagesRef, (messageSnapshot) => {
                const newMessage = messageSnapshot.val();

                if (newMessage.timestamp > lastDirectMessageTimestamp) {
                    const dmMembers = snapshot.child('members').val();
                    if (userData.username in dmMembers && userData.username !== newMessage.author && dmId !== currLocationId) {
                        const messageAuthor = users[newMessage.author];
                        notifyDirectMessage(
                            <DirectMessageNotification
                                avatar={messageAuthor?.avatar || null}
                                author={newMessage.author}
                                text={newMessage.text}
                                dmId={dmId}
                            />
                        );
                    }
                    setLastDirectMessageTimestamp(newMessage.timestamp);
                }
            });
        })


        return () => unsubscribes.forEach(unsubscribe => unsubscribe());

    }, [dmIds]);

    return (
        <>
        </>
    )
}

NotificationContainer.propTypes = {
};

export default NotificationContainer;