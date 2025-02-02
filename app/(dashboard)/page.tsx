
import React from "react";
import HomePageClient from "./_components/HomePageClient";
import Home from "@/components/Home";
import { getUser } from "@/utils/queries/queryDefinitions";




// The HomePage component
export default async function HomePage() {

    // Check user authentication state
    const isAuthenticated = await getUser();
    /*//console.log("isAuthenticated", isAuthenticated)
    // If not authenticated, render Home component
    if (isAuthenticated) {
        // If authenticated, fetch user data
        const user = await getUser();
        const username = await getUserName();
        const secretMessage = await getSecretMessage();
        const friends = (await getUserFriends()).map((friendId: string | null) => ({
            user_id: friendId,
            secret_message: null, // or any default value
        }));
        const pendingRequests = (await getPendingFriendRequests()).filter((req) => req !== null);
 
        // Combine all the data into a single object of type UserType
        const userData: UserType = {
            user: user,
            username: username,
            secretMessage: secretMessage,
            friends: friends,
            pendingRequests: pendingRequests,
        }; */
    if (isAuthenticated) {
        // Render the HomePageClient with the user data as props
        return <HomePageClient />;
    }

    // If not authenticated, render Home component
    return <Home />

}


