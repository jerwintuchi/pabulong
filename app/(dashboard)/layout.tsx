"use client";
// components/SecretLayout.tsx
import React from "react";
import NavLinks from "@/components/NavLinks";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { Toaster } from "react-hot-toast";

interface SecretLayoutProps {
    children: React.ReactNode;
}

export default function SecretLayout({ children }: SecretLayoutProps) {
    const { user: session } = useUser();
    const isAuthenticated = !!session.user;
    console.log("Session:", session);
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex flex-col min-h-screen max-w-5xl mx-auto">
                {/* Only show NavLinks if authenticated */}
                {isAuthenticated && <NavLinks />}

                {/* Main Content with padding for proper spacing */}
                <div className="flex flex-1 flex-col gap-6 px-6 py-4 mt-20">{children}</div>
            </div>
        </>
    );
}
