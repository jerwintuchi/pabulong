"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignOutButton from "@/components/buttons/signout-button";
import DeleteAccountButton from "@/components/buttons/delete-account-button";
import { useUser } from "@/contexts/UserContext";

export default function SecretPage1() {
    const { user, dispatch, loading } = useUser();


    if (loading) {
        return <p className="text-center text-gray-700 dark:text-gray-300">Loading...</p>;
    }

    if (!user) {
        console.log("USER DATA IS NULL");
        return null;
    }
    const secretMessage = user.secretMessage || "You don't have a secret message yet. Add some friends!";

    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">
                Secret Page 1
            </h1>
            <div className="mt-6 text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    {secretMessage || "You don't have a secret message yet. Add some friends!"}
                </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                <SignOutButton className="w-full sm:w-auto text-center" />
                <DeleteAccountButton />
            </div>
        </div>
    );
}
