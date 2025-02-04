/* "use client";
// contexts/UserContext.tsx
import { createContext, useContext, useEffect, useReducer, Dispatch, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client" // Make sure to import supabase client

import { getPendingFriendRequests, getSecretMessage, getUserFriends, getUserName, getFriendsSecretMessages, getUser, getAuthUser } from "@/utils/queries/queryDefinitions";
import { executeEventChannel } from "@/utils/subscriptions/event-channels";

// Define state
export interface UserState {
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
    | { type: "CLEAR_USER"; payload: Partial<UserState> }
    | { type: "SET_LOADING"; payload: boolean };

// Reducer function
const userReducer = (state: UserState, action: Action): UserState => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, ...action.payload };
        case "CLEAR_USER":
            return initialState
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
    const supabase = createClient();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            try {
                const userData = await getAuthUser(); // Await the function here
                if (!userData) {
                    setLoading(false);
                    return;
                }

                // Fetch other data like username, secret message, etc...
                const [username, secretMessage, friendsRaw, pendingRequests, friendsSecretMessages] = await Promise.all([
                    getUserName(),
                    getSecretMessage(),
                    getUserFriends(),
                    getPendingFriendRequests(),
                    getFriendsSecretMessages(),
                ]);

                const friends = friendsRaw.map((friendId: string | null) => ({
                    user_id: friendId,
                    secret_message: null,
                }));

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

                // Subscribe to real-time updates for secret messages, etc.
                const secretMessageChannel = await executeEventChannel({
                    channelName: "secret-message-updated",
                    user: userData,
                    dispatch,
                });

            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchUserData();

        // Set up a listener to react to authentication state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN") {
                await fetchUserData();
            }
            if (event === "SIGNED_OUT") {
                // Clear user state
                dispatch({ type: "SET_USER", payload: { user: null, username: null, secretMessage: null, friends: [], pendingRequests: [] } });
            }
        });

        // Clean up listener on component unmount
        return () => {
            authListener?.subscription.unsubscribe();
        };

    }, [dispatch, supabase, user]);

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
 */