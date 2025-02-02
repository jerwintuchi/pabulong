// app/(dashboard)/_components/HomePageClient.tsx
"use client"; // This marks the file as a client-side component

import React from "react";
import { usePathname } from "next/navigation";

import { UserType } from "@/app/types/definitions";
import SignOutButton from "@/components/buttons/signout-button";
import DeleteAccountButton from "@/components/buttons/delete-account-button";
import NavLinks from "@/components/NavLinks";

interface HomePageClientProps {
    user: UserType;
}

const sideNavLinks = [
    { href: "/secret-page-1", label: "🔒 Secret Page 1" },
    { href: "/secret-page-2", label: "✍️ Secret Page 2" },
    { href: "/secret-page-3", label: "👥 Secret Page 3" },
];

export default function HomePageClient({ user }: HomePageClientProps) {
    const pathname = usePathname();

    return (
        <div className="relative flex justify-center mt-20">
            {/* Main Content */}
            <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700">
                <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 text-center">
                    Hi, {user.username}!
                </h1>

                {/* Centered Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <SignOutButton className="w-full sm:w-auto text-center" />
                    <DeleteAccountButton />
                </div>
            </div>
        </div>
    );
}
