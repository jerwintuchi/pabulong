"use client";
// app/(dashboard)/page.tsx
import React from "react";
import HomePageClient from "./_components/HomePageClient";
import Home from "@/components/Home";
import { useUser } from "@/contexts/UserContext";




// The HomePage component
export default function HomePage() {
    const { user } = useUser();
    // Check user authentication state
    const isAuthenticated = user.user;

    if (isAuthenticated) {
        // Render the HomePageClient with the user data as props
        return <HomePageClient />;
    }

    // If not authenticated, render Home component
    return <Home />

}


