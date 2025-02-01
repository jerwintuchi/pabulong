"use client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import React from "react";
import { signOutAction } from "@/app/actions";
import { getUserName, handleDeleteAccount } from "@/utils/queries/queryDefinitions";
import { UserType } from "@/app/types/definitions";


// Accept user prop
interface HomePageClientProps {
    user: UserType;
}

export default function HomePageClient({ user }: HomePageClientProps) {
    /* const { secretMessage, friends, username } = useUser(); */

    return (
        <div className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                Hi, {user.username}
            </h1>
            <h1>
                <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                    Secret Message: {user.secretMessage || "No secret message yet. Add some friends!"}
                </span>
            </h1>

            {/* Navigation Links */}
            <nav className="mt-6 flex flex-col gap-4">
                {[{ href: "/secret-page-1", label: "🔒 Secret Page 1" }, { href: "/secret-page-2", label: "✍️ Secret Page 2" }, { href: "/secret-page-3", label: "👥 Secret Page 3" }]
                    .map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="block text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            {label}
                        </Link>
                    ))}
            </nav>

            {/* Sign Out & Delete Account Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <form className="w-full">
                    <Button
                        variant="outline"
                        onClick={signOutAction}
                        className="w-full sm:w-auto"
                    >
                        Sign Out
                    </Button>
                </form>

                <form className="w-full">
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </Button>
                </form>
            </div>
        </div>
    );
}
