"use client";
import { UserType } from '@/app/types/definitions';
import { SubmitButton } from '@/components/buttons/submit-button';
import SecretMessage from '@/components/SecretMessage';
import { updateSecretMessage } from '@/utils/queries/queryDefinitions';
import React, { useActionState, useEffect, useState } from 'react'
import { BsFillSendFill } from 'react-icons/bs';

interface SecretPage2Props {
    user: UserType
}

export default function SecretPage2Client({ user }: SecretPage2Props) {
    //const { user, dispatch, loading } = useUser();
    const secretMessage = user.secretMessage || "You don't have a secret message yet.";
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, [])

    const [status, formAction] = useActionState(updateSecretMessage, null);


    /* if (loading) {
        return <p className="text-center text-gray-500">Loading user data...</p>;
    } */

    return (
        <div className={`max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 mt-10 ${mounted ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 text-center">
                Secret Page 2
            </h1>
            <p className="text-center text-gray-500 pb-4">Username: {user.username}</p>
            <SecretMessage secretMessage={secretMessage} />
            <form action={formAction} className="mt-12">
                <label htmlFor="message" className="block text-sm font-medium">
                    Update Secret Message:
                </label>
                <textarea
                    name="message"
                    id="message"
                    defaultValue={""}
                    className="w-full p-2 border rounded mt-1"
                    required
                />
                <SubmitButton className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-sm">
                    {secretMessage ? <BsFillSendFill /> : "Add Message"}
                </SubmitButton>
            </form>

            {status && <p className="mt-3 text-center text-sm text-gray-600">{status}</p>}
        </div>
    );
}
