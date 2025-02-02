// app/(dashboard)/layout.tsx
import React from "react";
import NavLinks from "@/components/NavLinks";
import { UserProvider } from "@/contexts/UserContext";

interface SecretLayoutProps {
    children: React.ReactNode;
}

export default function SecretLayout({ children }: SecretLayoutProps) {
    return (
        <UserProvider>
            <div className="flex flex-col min-h-screen max-w-5xl mx-auto">
                {/* Fixed NavLinks */}
                <NavLinks />

                {/* Main Content with padding for proper spacing */}
                <div className="flex flex-1 flex-col gap-6 px-6 py-4 mt-20">{children}</div>
            </div>
        </UserProvider>
    );
}
