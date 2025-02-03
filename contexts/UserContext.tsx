"use client";
import React, { createContext, useContext, useEffect, useReducer, Dispatch, useState } from "react";
import { getAuthUser, getPendingFriendRequests, getSecretMessage, getUserFriends, getUserName, getFriendsSecretMessages } from "@/utils/queries/queryDefinitions";

import { User } from "@supabase/supabase-js";
import { executeEventChannel } from "@/utils/subscriptions/event-channels";

// Define state
interface UserState {
    user: User | null;
    username: string | null;
    secretMessage: string | null;
    friends: { user_id: string | null; secret_message: string | null }[];
    pendingRequests: (string | null)[];
}

// Initial state
const initialState: UserState = {
    user: null,
    username: null,
    secretMessage: null,
    friends: [],
    pendingRequests: [],
};

// Define action types
export type Action =
    | { type: "SET_USER"; payload: Partial<UserState> }
    | { type: "SET_LOADING"; payload: boolean };

// Reducer function
const userReducer = (state: UserState, action: Action): UserState => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

// Define context type
interface UserContextValue {
    user: UserState;
    dispatch: Dispatch<Action>;
    loading: boolean;
}

// Create context
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, dispatch] = useReducer(userReducer, initialState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true); // Ensure loading state is correctly managed

            try {
                const userData = await getAuthUser(); // Await the function here

                if (!userData) {
                    setLoading(false);
                    return;
                }

                const [username, secretMessage, friendsRaw, pendingRequests, friendsSecretMessages] = await Promise.all([
                    getUserName(),
                    getSecretMessage(),
                    getUserFriends(),
                    getPendingFriendRequests(),
                    getFriendsSecretMessages(), // Fetch secret messages of friends
                ]);

                const friends = friendsRaw.map((friendId: string | null) => ({
                    user_id: friendId,
                    secret_message: null, // Default placeholder, will be filled from friendsSecretMessages
                }));

                const pendingRequestsFromContext = await getPendingFriendRequests();
                console.log("Pending Friend Requests: ", pendingRequestsFromContext);
                // Now match each friend with their secret message
                const friendsWithMessages = friends.map((friend) => {
                    const matchingMessage = friendsSecretMessages.find(
                        (f) => f.user_id === friend.user_id
                    );
                    return {
                        ...friend,
                        secret_message: matchingMessage ? matchingMessage.secret_message : null,
                    };
                });

                dispatch({
                    type: "SET_USER",
                    payload: {
                        user: userData,
                        username,
                        secretMessage,
                        friends: friendsWithMessages,
                        pendingRequests,
                    },
                });

                const secretMessageChannel = await executeEventChannel({
                    channelName: "secret-message-updated",
                    user: userData,
                    dispatch,
                });
                if (secretMessageChannel) {
                    console.log("secret message channel executed");
                }

            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, dispatch, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook
export const useUser = (): UserContextValue => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
