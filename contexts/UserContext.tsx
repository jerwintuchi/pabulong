/* "use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { getUserProfile, getFriendsSecretMessages, getUserFriends, getPendingFriendRequests, getUserName } from "@/utils/queries/queryDefinitions";

const supabase = createClient();

// Define the User Context type
interface UserContextType {
    user: User | null;
    username: string | null;
    secretMessage: string | null;
    friends: { user_id: string | null; secret_message: string | null }[];
    pendingRequests: string[];
    loading: boolean;
}

// Initialize User Context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// User Context Provider Component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [secretMessage, setSecretMessage] = useState<string | null>(null);
    const [friends, setFriends] = useState<{ user_id: string | null; secret_message: string | null; }[]>([]);
    const [pendingRequests, setPendingRequests] = useState<string[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                console.log("No user logged in or error fetching user data.");
                setLoading(false);
                return;
            }

            const currentUser = await supabase.from("profiles").select("user_id").eq("user_id", user.id).single();
            console.log(user.id)
            console.log("Current user: ", currentUser);
            const { user_id: userId } = currentUser.data || {};

            if (!userId) {
                console.log("User ID not found in profiles table.");
                setLoading(false);
                return;
            }
            try {
                const username = await getUserName(userId);
                if (username) {
                    setUsername(username);
                }

                const profileSecretMessage = await getUserProfile(userId);
                if (profileSecretMessage) {
                    setSecretMessage(profileSecretMessage);
                } else {
                    console.log("Profile not found for the user");
                }

                const friendIds = await getUserFriends(user.id);
                setFriends(await getFriendsSecretMessages(friendIds.map((id: string) => id ?? '')));

                const pendingRequestsData = (await getPendingFriendRequests(user.id))?.filter((id: string) => id !== null) || [];
                setPendingRequests(pendingRequestsData);

                setUser(user); // Ensure the user state is set here
            } catch (fetchError) {
                console.log("Error fetching data: ", fetchError);
            }

            setLoading(false);
        };

        fetchData(); // Ensure fetchData is executed when the component mounts

    }, []);


    return (
        <UserContext.Provider value={{ user, secretMessage, friends, pendingRequests, username, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access the user context
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
 */