/* // context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUser, getUserName, getSecretMessage, getUserFriends, getPendingFriendRequests } from "@/utils/queries/queryDefinitions";
import { User } from "@supabase/supabase-js";

// Define the shape of the user data
export interface UserData {
    user: User | null; // Replace with actual user type
    username: string | null;
    secretMessage: string | null | undefined;
    friends: Array<{ user_id: string | null; secret_message: string | null }>;
    pendingRequests: any[]; // Replace with actual request type
}

interface AuthContextType {
    userData: UserData | null;
    isAuthenticated: boolean;
    loading: boolean;
    fetchUserData: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch user data and set it in state
    const fetchUserData = async () => {
        try {
            const user = await getUser();
            if (user) {
                const username = await getUserName();
                const secretMessage = await getSecretMessage();
                const friends = (await getUserFriends()).map((friendId: string | null) => ({
                    user_id: friendId,
                    secret_message: null,
                }));
                const pendingRequests = (await getPendingFriendRequests()).filter((req) => req !== null);

                setUserData({
                    user,
                    username,
                    secretMessage,
                    friends,
                    pendingRequests,
                });
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ userData, isAuthenticated, loading, fetchUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
 */