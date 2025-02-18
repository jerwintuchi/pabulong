"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface SecretMessageProps {
    secretMessage: string | null;
}

export default function SecretMessage({ secretMessage }: SecretMessageProps) {
    const [currentMessage, setCurrentMessage] = useState<string | null>(secretMessage);
    const [previousMessage, setPreviousMessage] = useState<string | null>(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            return localStorage.getItem('previousSecretMessage');
        }
        return null;
    });
    
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        // Update previous message when current message changes
        if (secretMessage !== currentMessage && currentMessage !== null) {
            localStorage.setItem('previousSecretMessage', currentMessage);
            setPreviousMessage(currentMessage);
        }
        setCurrentMessage(secretMessage);
    }, [secretMessage]);

    useEffect(() => {
        const profiles = supabase.channel('secret-message-updates')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log('Change received!', payload);

                    if (payload.new && payload.new.secret_message) {
                        // Store current message as previous before updating
                        if (currentMessage && currentMessage !== payload.new.secret_message) {
                            localStorage.setItem('previousSecretMessage', currentMessage);
                            setPreviousMessage(currentMessage);
                        }
                        
                        // Update current message
                        setCurrentMessage(payload.new.secret_message);
                    }

                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(profiles);
        };
    }, [supabase, router, currentMessage]);

    return (
        <div className="flex flex-col text-sm text-gray-400 p-4 border border-zinc-50 rounded-sm ">
            Previous Message:
            <span className="text-teal-400 pl-2 pb-2">
                {previousMessage || "No previous message"}
            </span>
            My Secret Message:
            <span className="text-teal-400 pl-2">
                {currentMessage || "No message yet."}
            </span>
        </div>
    );
}