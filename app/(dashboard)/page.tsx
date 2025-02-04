import React from "react";
import HomePageClient from "./_components/HomePageClient";
import Home from "@/components/Home";
import { getServerUser } from "@/utils/helpers/user-server";

// The HomePage component
export default async function HomePage() {
    const user = await getServerUser();
    // Check user authentication state
    const isAuthenticated = user;

    // Pass user data to HomePageClient to avoid refetching
    return isAuthenticated ? <HomePageClient user={user} /> : <Home />;
}
