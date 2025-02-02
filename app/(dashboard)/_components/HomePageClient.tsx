"use client";
import { UserType } from "@/app/types/definitions";
import DeleteAccountButton from "@/components/buttons/delete-account-button";
import SignOutButton from "@/components/buttons/signout-button";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

export default function HomePageClient() {
    const user = useUser();
    const [userState, setUserState] = useState<UserType | null>(user);

    useEffect(() => {
        setUserState(user);
    }, [user]); // ✅ Now updates when `user` changes

    return (
        <div className="relative flex justify-center mt-20">
            {/* Main Content */}
            <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700">
                <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 text-center">
                    Hi, {userState?.username}!
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
