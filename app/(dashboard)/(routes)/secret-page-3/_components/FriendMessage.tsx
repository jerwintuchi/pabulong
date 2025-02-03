import React from 'react';

interface FriendMessageProps {
    selectedFriend: string | null;
    selectedFriendMessage: string | null | undefined;
    allUsers: { user_id: string; username: string }[]; // Add allUsers prop
}

export default function FriendMessage({ selectedFriend, selectedFriendMessage, allUsers }: FriendMessageProps) {
    // Find the selected friend's username from the allUsers list
    const selectedFriendUser = allUsers.find(user => user.user_id === selectedFriend);

    return (
        <>
            {selectedFriend && selectedFriendUser && (
                <div className="my-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Secret Message from {selectedFriendUser.username} {/* Use username here */}
                    </h2>
                    <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        {selectedFriendMessage ? (
                            <p className="text-gray-800 dark:text-gray-200">{selectedFriendMessage}</p>
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500">No secret message available.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
