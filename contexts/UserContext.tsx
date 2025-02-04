import { UserType } from "@/app/types/definitions"; // Ensure this is the correct UserType interface
import { getServerUser } from "@/utils/helpers/user-server";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Define the UserContextType with UserType for userData
interface UserContextType {
    userData: UserType | null;
    setUserData: (data: UserType | null) => void;
    loading: boolean;
}

// Create a context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}


export const UserProvider = ({ children }: UserProviderProps) => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const serverUser = await getServerUser();
                if (!serverUser) {
                    setLoading(false);
                    return;
                }

                const user: UserType = {
                    user: serverUser.user,
                    username: serverUser.username,
                    secretMessage: serverUser.secretMessage,
                    friends: serverUser.friends,
                    pendingRequests: serverUser.pendingRequests,
                };

                setUserData(user);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []); // Run the fetch only once on component mount

    return (
        <UserContext.Provider value={{ userData, setUserData, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access the UserContext
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
