

interface FriendRequestProps {
    usersToAdd: string[]
}
export default function FriendRequest({ usersToAdd }: FriendRequestProps) {
    return (
        <div className="my-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Friend Requests</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersToAdd.length === 0 ? (
                    <p>No pending friend requests.</p>
                ) : (
                    usersToAdd.map((userId) => (
                        <div key={userId} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{userId}</p>
                            <button className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg">
                                Add Friend
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
