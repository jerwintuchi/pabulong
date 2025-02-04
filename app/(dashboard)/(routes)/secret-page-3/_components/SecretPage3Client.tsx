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

    useEffect(() => {
        if (!user) return; // Skip if the user is not available

        const fetchUsers = async () => {
            setLoading(true); // Start loading
            try {
                const users = await getAllUsers(); // Fetch users
                const usersList = users?.map(user => ({
                    id: user.id,
                    user_id: user.user_id ?? "",
                    username: user.username ?? "",
                    email: user.email ?? "",
                    secret_message: user.secret_message ?? "",
                })) ?? [];
                setAllUsers(usersList); // Set the fetched users
            } catch (error) {
                console.error("Error fetching all users:", error); // Improved error handling
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUsers(); // Fetch users on mount or when `user` changes
    }, [user]);

    // Users to add (pending friend requests excluding the current user)
    const usersToAdd = (user?.pendingRequests || [])
        .filter((username): username is string => username !== null && username !== user.username);

    // Friends List
    const friends = user?.friends || [];

    // Selected friend's secret message
    const selectedFriendMessage = friends.find(friend => friend.user_id === selectedFriend)?.secret_message;

    // Filtered users excluding the current user
    const filteredUsers = allUsers?.filter(u => u.user_id !== user?.user?.id) ?? [];

    return (
        <div className={`max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 mt-10 ${loading ? "opacity-50" : "opacity-100"} transition-opacity duration-1000`}>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 text-center">
                Secret Page 3
            </h1>

            {/* Card 1: Users to Add */}
            <FriendRequest usersToAdd={usersToAdd} />

            {/* Card 2: Friends List */}
            <FriendList friends={friends} setSelectedFriend={setSelectedFriend} allUsers={filteredUsers} />

            {/* Card 3: Friend's Secret Message */}
            <FriendMessage
                selectedFriend={selectedFriend}
                selectedFriendMessage={selectedFriendMessage}
                allUsers={filteredUsers}
            />

            {/* Card 4: Scrollable List of All Users (excluding current user) */}
            {filteredUsers.length > 0 ? (
                <ScrollableUserList users={filteredUsers} friends={friends} />
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-4">No users available...</div>
            )}
        </div>
    );
}
