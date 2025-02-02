"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { handleDeleteAccount } from "@/utils/queries/queryDefinitions";
import { UserType } from "@/app/types/definitions";
import SignOutButton from "@/components/buttons/signout-button";
import DeleteAccountButton from "@/components/buttons/delete-account-button";

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
        <div className="relative flex justify-center">
            {/* Main Content */}
            <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700">
                <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 text-center">
                    Hi, {user.username}
                </h1>
                <p className="mt-2 text-gray-700 dark:text-gray-300 text-center">
                    Secret Message: {user.secretMessage || "No secret message yet. Add some friends!"}
                </p>

                {/* Centered Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <SignOutButton className="w-full sm:w-auto text-center" />
                    <DeleteAccountButton />
                </div>
            </div>

            {/* Right Side HUD (Fixed Navigation) */}
            <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                {sideNavLinks.map(({ href, label }) => (
                    <Link key={href} href={href}>
                        <div
                            className={`relative px-4 py-3 w-48 text-gray-900 dark:text-gray-200 rounded-l-xl transition-all 
                            ${pathname === href ? "bg-blue-500 text-white font-semibold shadow-lg" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                        >
                            {pathname === href && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-full bg-blue-600 rounded-l-md"></span>
                            )}
                            {label}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
