import { acceptFriendRequest, sendFriendRequest } from "@/utils/queries/queryDefinitions"
import toast from "react-hot-toast";


interface FriendRequestProps {
    usersToAdd: string[]
}
export default function FriendRequest({ usersToAdd }: FriendRequestProps) {
    const handleAcceptFriendRequest = async (username: string) => {
        const response = await acceptFriendRequest(username);
        console.log("Response:", response);
        if (response === "Friend request accepted successfully!") {
            toast.success("Friend request accepted successfully!");
        }
        else {
            toast.error("Error accepting friend request.");
        }
    };


    return (
        <div className="my-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Friend Requests</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersToAdd.length === 0 ? (
                    <p>No pending friend requests.</p>
                ) : (
                    usersToAdd.map((username) => (
                        <div key={username} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{username}</p>
                            <button onClick={() => { handleAcceptFriendRequest(username) }} className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg">
                                Accept
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
