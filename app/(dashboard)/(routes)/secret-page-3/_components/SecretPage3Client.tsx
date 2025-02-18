"use client";

import { getAllUsers } from '@/utils/queries/queryDefinitions';
import React, { useEffect, useState } from 'react';
import FriendList from './FriendList';
import FriendMessage from './FriendMessage';
import FriendRequest from './FriendRequest';
import ScrollableUserList from './ScrollableUserList';

import { UserType } from '@/app/types/definitions';

interface SecretPage3ClientProps {
    user: UserType;
}

export default function SecretPage3Client({ user }: SecretPage3ClientProps) {
    const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<{ id: string; user_id: string; username: string; email: string; secret_message: string }[] | null>(null);
    const [loading, setLoading] = useState(true);

    // Debug log to check incoming user data
    useEffect(() => {
        console.log('User data received:', user);
        console.log('Friends data:', user?.friends);
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const users = await getAllUsers();
                const usersList = users?.map(user => ({
                    id: user.id,
                    user_id: user.user_id ?? "",
                    username: user.username ?? "",
                    email: user.email ?? "",
                    secret_message: user.secret_message ?? "",
                })) ?? [];
                setAllUsers(usersList);
            } catch (error) {
                console.error("Error fetching all users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user]);

    // Debug log when selected friend changes
    useEffect(() => {
        if (selectedFriend) {
            const friend = user?.friends?.find(f => f.user_id === selectedFriend);
            console.log('Selected friend data:', friend);
        }
    }, [selectedFriend, user?.friends]);

    const usersToAdd = (user?.pendingRequests || [])
        .filter((username): username is string => username !== null && username !== user.username);

    const friends = user?.friends || [];

    // Debug log to check message retrieval
    const selectedFriendMessage = friends.find(friend => friend.user_id === selectedFriend)?.secret_message;
    console.log('Selected friend message:', selectedFriendMessage);

    const filteredUsers = allUsers?.filter(u => u.user_id !== user?.user?.id) ?? [];

    return (
        <div className={`max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 mt-10 ${loading ? "opacity-50" : "opacity-100"} transition-opacity duration-1000`}>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 text-center">
                Secret Page 3
            </h1>

            {/* Debug section */}
            <div className="hidden">
                <pre>{JSON.stringify(user?.friends, null, 2)}</pre>
            </div>

            <FriendRequest usersToAdd={usersToAdd} />
            <FriendList
                friends={friends}
                setSelectedFriend={setSelectedFriend}
                allUsers={filteredUsers}
            />
            <FriendMessage
                selectedFriend={selectedFriend}
                selectedFriendMessage={selectedFriendMessage}
                allUsers={filteredUsers}
            />

            {filteredUsers.length > 0 ? (
                <ScrollableUserList users={filteredUsers} friends={friends} />
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-4">No users available...</div>
            )}
        </div>
    );
}