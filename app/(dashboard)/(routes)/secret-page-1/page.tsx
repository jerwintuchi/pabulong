// Add this to mark the component as a client component
"use client";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import { handleDeleteAccount } from "@/utils/queries/queryDefinitions";

export default function SecretPage1() {

    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center">Secret Page 1</h1>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-center">
                {"secretmessage to be fetched"}
            </p>
            <div className="mt-6 flex gap-4 justify-center">
                <form className="w-full">
                    <Button
                        variant="outline"
                        onClick={signOutAction}
                        className="w-full sm:w-auto"
                    >
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    );
}
