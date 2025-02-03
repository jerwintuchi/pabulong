// app/(dashboard)/page.tsx
import React from "react";
import HomePageClient from "./_components/HomePageClient";
import Home from "@/components/Home";
import { getUser } from "@/utils/queries/queryDefinitions";




// The HomePage component
export default async function HomePage() {

    // Check user authentication state
    const isAuthenticated = await getUser();

    if (isAuthenticated) {
        // Render the HomePageClient with the user data as props
        return <HomePageClient />;
    }

    // If not authenticated, render Home component
    return <Home />

}


