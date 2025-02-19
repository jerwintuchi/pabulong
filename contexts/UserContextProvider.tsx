"use client"; 

import { createClient } from "@/utils/supabase/client";
import React, { createContext, useReducer, useContext, useEffect } from "react";


const supabase = createClient();

// Define User Type
interface UserType {
    id: string;
    name: string;
    secretMessage?: string;
    friends?: string[];
    pendingRequests?: string[];
    friendsMessages?: string[];
    pendingRequestsMessages?: string[];
    allUsers?: { id: string; user_id: string; username: string; email: string; secret_message: string }[];
    user_id?: string;
    username?: string;
    email?: string;
    secret_message?: string;
}

// Define State & Actions
interface State {
    user: UserType | null;
}

type Action = { type: "SET_USER"; payload: UserType } | { type: "LOGOUT" };

const userReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        default:
            return state;
    }
};

// Create Context
const UserContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Provider Component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, { user: null });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                //  Fetch user from Supabase instead of getServerUser()
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    dispatch({ type: "LOGOUT" });
                    return;
                }

                //  Fetch additional user details from Supabase
                const { data: userData, error } = await supabase
                    .from("users")
                    .select("id, name, secretMessage, friends")
                    .eq("id", user.id)
                    .single();

                if (error) {
                    console.error("Error fetching user data:", error);
                    return;
                }

                if (userData) {
                    dispatch({ type: "SET_USER", payload: userData });
                }
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        fetchUser();

        //  Listen for authentication changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                dispatch({ type: "LOGOUT" });
            } else {
                fetchUser(); //  Re-fetch user on login
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

// Custom Hook for consuming context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
