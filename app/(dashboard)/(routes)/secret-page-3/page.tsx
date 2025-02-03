"use client";

import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import FriendRequest from "./_components/FriendRequest";
import FriendList from "./_components/FriendList";
import FriendMessage from "./_components/FriendMessage";
import ScrollableUserList from "./_components/ScrollableUserList";
import { getAllUsers } from "@/utils/queries/queryDefinitions";


export default function Page() {
    const { user, loading } = useUser();
    const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<{ id: string; user_id: string; username: string; email: string; secret_message: string }[] | null>(null);

    // Always call hooks before conditional logic
    useEffect(() => {
        if (loading || !user) {
            return; // Skip fetching users if the user data is still loading or not available
        }

        const fetchUsers = async () => {
            try {
                const users = await getAllUsers(); // Call API or query to fetch all users
                const usersList = users?.map(user => ({
                    id: user.id,
                    user_id: user.user_id ?? "", // Fallback to empty string if null
                    username: user.username ?? "",
                    email: user.email ?? "", // Add email to the data
                    secret_message: user.secret_message ?? "" // Fallback to empty string if null
                })) ?? [];
                setAllUsers(usersList); // Set the users data in state
            } catch (error) {
                console.error("Error fetching all users:", error); // Improved error handling
            }
        };

        fetchUsers();
    }, [loading, user]); // Make sure to add dependencies here

    if (loading) {
        return <div>Loading...</div>; // Always handle loading state before rendering the component
    }

    // Filter users to add (pending requests), excluding the current user
    const usersToAdd = (user?.pendingRequests || [])
        .filter((username): username is string => username !== null && username !== user.username); // Exclude current user
    console.log("usersToAdd: ", usersToAdd);
    // Display Accepted Friends
    const friends = user?.friends || [];

    // Find the selected friend's secret message
    const selectedFriendMessage = friends.find(
        (friend) => friend.user_id === selectedFriend
    )?.secret_message;

    // Filter out the current user from allUsers list
    const filteredUsers = allUsers?.filter(u => u.user_id !== user?.user?.id) ?? [];


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 mt-10">
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
