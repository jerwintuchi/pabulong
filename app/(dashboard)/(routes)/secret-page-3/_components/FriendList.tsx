import React from 'react'

interface FriendListProps {
    friends: { user_id: string | null; secret_message: string | null }[]
    setSelectedFriend: (userId: string | null) => void
}
export default function FriendList({ friends, setSelectedFriend }: FriendListProps) {
    return (
        <div className="my-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Friends</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.length === 0 ? (
                    <p>No accepted friends.</p>
                ) : (
                    friends.map((friend) => (
                        <div
                            key={friend.user_id}
                            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
                            onClick={() => setSelectedFriend(friend.user_id)}
                        >
                            <p className="font-medium text-gray-800 dark:text-gray-200">{friend.user_id}</p>
                        </div>
                    ))
                )}
            </div>
        </div>

    )
}
