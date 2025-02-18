import React from "react";
import HomePageClient from "./_components/HomePageClient";
import Home from "@/components/Home";
import { getServerUser } from "@/utils/helpers/user-server";

// The HomePage component
export default async function HomePage() {
    const user = await getServerUser({
        includeSecretMessage: true,
        includeFriends: true,
        includePendingRequests: true,
        includeFriendsMessages: true
    });
    const isAuthenticated = user;
    return isAuthenticated ? <HomePageClient user={user} /> : <Home />;
}
