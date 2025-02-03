"use client";

import { useUser } from "@/contexts/UserContext";
import DeleteAccountButton from "@/components/buttons/delete-account-button";
import SignOutButton from "@/components/buttons/signout-button";
import { useEffect, useState } from "react";

export default function HomePageClient() {
    const { user, loading } = useUser();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    })

    if (loading) {
        return <p className="text-center text-gray-500">Loading user data...</p>;
    }

    return (
        <div className="relative flex justify-center mt-20">
            <div className={`max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 ${mounted ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>
                <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 text-center">
                    Hi, {user?.username}!
                </h1>

                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <SignOutButton className="w-full sm:w-auto text-center" />
                    <DeleteAccountButton />
                </div>
            </div>
        </div>
    )
}
