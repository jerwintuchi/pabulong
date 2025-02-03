"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface SecretMessageProps {
    secretMessage: string | null;
}

export default function SecretMessage({ secretMessage }: SecretMessageProps) {
    const [oldMessage, setOldMessage] = useState<string | null>(secretMessage);  // Initially set old message to the current one
    const [currentMessage, setCurrentMessage] = useState<string | null>(secretMessage);  // Track the current message
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const profiles = supabase.channel('secret-message-updates')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log('Change received!', payload);  // Log the payload to verify if it's being triggered

                    // Store the current message as the previous one before the update
                    setOldMessage(currentMessage);  // Update the old message to the current message before change

                    // Set the current message with the new updated message from the payload
                    if (payload.new && payload.new.secret_message) {
                        setCurrentMessage(payload.new.secret_message);  // Update the current message
                    }

                    // Refresh the page or re-render the necessary parts
                    router.refresh();
                }
            )
            .subscribe();

        // Clean up the channel on component unmount
        return () => {
            supabase.removeChannel(profiles);
        };
    }, [supabase, router, currentMessage]);  // Include `currentMessage` to track it when updating

    return (
        <div className="flex flex-col text-sm text-gray-400 p-4 border border-zinc-50 rounded-sm ">
            Previous Message:
            <span className="text-teal-400 pl-2 pb-2">{oldMessage || "No previous message"}</span>  {/* Display the old message */}
            My Secret Message:
            <span className="text-teal-400 pl-2">{currentMessage || "No message yet."}</span>  {/* Display the current message */}
        </div>
    );
}
