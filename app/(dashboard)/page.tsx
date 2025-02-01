import React from "react";
import HomePageClient from "./_components/HomePageClient";
import Home from "@/components/Home";
import { getPendingFriendRequests, getSecretMessage, getUser, getUserFriends, getUserName } from "@/utils/queries/queryDefinitions";
import { UserType } from "../types/definitions";



// The HomePage component
export default async function HomePage() {

    // Check user authentication state
    const isAuthenticated = await getUser();
    console.log("isAuthenticated", isAuthenticated)
    // If not authenticated, render Home component
    if (!isAuthenticated) {
        return <Home />;
    }
    // If authenticated, fetch user data
    const user = await getUser(); // Assuming getUser() returns the full user data
    const username = await getUserName(); // Assuming user.id is available
    const secretMessage = await getSecretMessage();
    const friends = await getUserFriends(); // Assuming `user.friends` is an array
    const pendingRequests = await getPendingFriendRequests(); // Assuming `user.pendingRequests` is an array

    // Combine all the data into a single object of type UserType
    const userData: UserType = {
        user: user,
        username: username,
        secretMessage: secretMessage,
        friends: friends,
        pendingRequests: pendingRequests,
    };

    // Render the HomePageClient with the user data as props
    return <HomePageClient user={userData} />;

}


