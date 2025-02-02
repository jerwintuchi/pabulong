"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
    getPendingFriendRequests,
    getSecretMessage,
    getUser,
    getUserFriends,
    getUserName
} from "@/utils/queries/queryDefinitions";
import { UserType } from "@/app/types/definitions";

// Define context type
interface UserContextType {
    user: UserType | null;
    loading: boolean;
}

// Create context with default values
const UserContext = createContext<UserContextType>({ user: null, loading: true });

// Provider component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser();
                if (!userData) return;

                const [username, secretMessage, friendsRaw, pendingRequests] = await Promise.all([
                    getUserName(),
                    getSecretMessage(),
                    getUserFriends(),
                    getPendingFriendRequests(),
                ]);

                const friends = friendsRaw.map((friendId: string | null) => ({
                    user_id: friendId,
                    secret_message: null, // Default placeholder
                }));

                setUser({
                    user: userData,
                    username,
                    secretMessage,
                    friends,
                    pendingRequests,
                });
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook
export const useUser = () => useContext(UserContext);
