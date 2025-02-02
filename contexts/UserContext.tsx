"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getPendingFriendRequests, getSecretMessage, getUser, getUserFriends, getUserName } from "@/utils/queries/queryDefinitions";
import { UserType } from "@/app/types/definitions";


// Create the context
const UserContext = createContext<UserType | null>(null);

// Provider component to wrap the app
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<UserType | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            /* const isAuthenticated = await getUserClient(); */
            const isAuthenticated = await getUser();

            if (isAuthenticated) {
                const [user, username, secretMessage, friendsRaw, pendingRequests] = await Promise.all([
                    getUser(),
                    getUserName(),
                    getSecretMessage(),
                    getUserFriends(),
                    getPendingFriendRequests(),
                ])
                /* const user = await getUser();
                const username = await getUserName();
                const secretMessage = await getSecretMessage();
                const friends = (await getUserFriends()).map((friendId: string | null) => ({
                    user_id: friendId,
                    secret_message: null, // default value
                }));
                const pendingRequests = (await getPendingFriendRequests()).filter((req) => req !== null);
                    */
                // Transform friends to match expected structure
                const friends = friendsRaw.map((friendId: string | null) => ({
                    user_id: friendId,
                    secret_message: null, // Default value
                }));

                const userData: UserType = {
                    user,
                    username,
                    secretMessage,
                    friends,
                    pendingRequests,
                };


                console.log("userData", userData);

                setUserData(userData);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access the user data context
export const useUser = () => useContext(UserContext);
