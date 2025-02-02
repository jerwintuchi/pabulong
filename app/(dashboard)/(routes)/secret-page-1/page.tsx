"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import { getSecretMessage, handleDeleteAccount } from "@/utils/queries/queryDefinitions"; // Assuming this is where your query for secret message exists
import SignOutButton from "@/components/buttons/signout-button";
import DeleteAccountButton from "@/components/buttons/delete-account-button";

// Secret Page Component
export default function SecretPage1() {
    const [secretMessage, setSecretMessage] = useState<string | null>(null);

    // Fetch the secret message once the component is mounted
    useEffect(() => {
        const fetchSecretMessage = async () => {
            const message = await getSecretMessage();
            if (message !== undefined) { // Add a null check
                setSecretMessage(message);
            } else {
                setSecretMessage("You don't have a secret message yet. Add some friends!"); // or set a default value
            }
        };

        fetchSecretMessage();
    }, []); // Empty dependency array ensures this runs once on component mount

    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">
                Secret Page 1
            </h1>

            {/* Display Secret Message */}
            <div className="mt-6 text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    {secretMessage || "You don't have a secret message yet. Add some friends!"}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                <SignOutButton className="w-full sm:w-auto text-center" />
                <DeleteAccountButton />
            </div>
        </div>
    );
}
