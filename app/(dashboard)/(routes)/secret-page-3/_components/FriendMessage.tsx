import React from 'react';

interface FriendMessageProps {
    selectedFriend: string | null;
    selectedFriendMessage: string | null | undefined;
    allUsers: { user_id: string; username: string }[];
}

export default function FriendMessage({ selectedFriend, selectedFriendMessage, allUsers }: FriendMessageProps) {
    const selectedFriendUser = allUsers.find(user => user.user_id === selectedFriend);

    // Debug log
    console.log('FriendMessage props:', {
        selectedFriend,
        selectedFriendMessage,
        selectedFriendUser
    });

    return (
        <>
            {selectedFriend && selectedFriendUser && (
                <div className="my-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Secret Message from {selectedFriendUser.username}
                    </h2>
                    <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        {selectedFriendMessage ? (
                            <p className="text-gray-800 dark:text-gray-200">{selectedFriendMessage}</p>
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500">
                                {selectedFriendUser.username} hasn't shared a secret message yet.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}