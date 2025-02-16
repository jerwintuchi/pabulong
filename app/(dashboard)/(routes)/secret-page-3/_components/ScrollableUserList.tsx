import { Button } from "@/components/ui/button";
import { sendFriendRequest } from "@/utils/queries/queryDefinitions";
import toast from "react-hot-toast";
import { IoMdPersonAdd } from "react-icons/io";

interface ScrollableUserListProps {
    users: { id: string; user_id: string; username: string; email: string; secret_message: string }[];
    friends: { user_id: string | null; secret_message: string | null }[]; // Allow nullable values for user_id and secret_message
}

const ScrollableUserList: React.FC<ScrollableUserListProps> = ({ users, friends }) => {
    // Handle the friend request click
    const handleFriendRequest = async (userId: string) => {
        const response = await sendFriendRequest(userId);
        console.log("Response:", response);
        if (response === "Friend request sent successfully!") {
            toast.success("Friend request sent successfully!");
        } else if (response === "You are already friends with this user.") {
            toast.error("You are already friends with this user.");
        } else if (response === "Friend request is already pending.") {
            toast.custom("Friend request is already pending.");
        } else {
            toast.error("Error sending friend request.");
        }
    };

    // Filter out accepted friends from the users list
    const filteredUsers = users.filter(user => !friends.some(friend => friend.user_id === user.user_id));

    return (
        <div className="overflow-y-auto max-h-60 border-t border-gray-300 dark:border-gray-700 mt-4">
            <div className="space-y-2 p-4">
                {filteredUsers.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400">No users available</p>
                ) : (
                    filteredUsers.map((user, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800 dark:text-gray-200">{user.username}
                                    <span className="text-gray-600 dark:text-gray-400 pl-4 text-xs">{user.email}</span>
                                </p>
                                <div className="flex items-center">
                                    <IoMdPersonAdd
                                        onClick={() => {
                                            console.log("Friend Request triggered for user:", user.username);
                                            handleFriendRequest(user.user_id);
                                        }}
                                        className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ScrollableUserList;
