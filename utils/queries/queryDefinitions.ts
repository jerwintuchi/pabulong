"use server";

import { createClient } from "../supabase/server";

// Fetch authenticated user
export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
export const getAuthUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data?.user || null;
};

export const getAllUsers = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error("Error fetching users:", error);
    return null;
  }

  return data || null;
};

// Fetch secret message of the logged-in user
export const getSecretMessage = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("secret_message")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching secret message:", error);
      return null;
    }
    return data?.secret_message;
  } catch (error) {
    console.error("Unexpected error fetching secret message:", error);
    return null;
  }
};

// Update or insert secret message for a user
export const updateSecretMessage = async (
  prevState: string | null, // Accept previous state (useFormState requirement)
  formData: FormData
) => {
  const message = formData.get("message")?.toString();
  if (!message) {
    return "Message cannot be empty.";
  }
  console.log("message received : ", message);
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user?.data?.user) {
    return "User not logged in.";
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  const username = await getUserName();
  if (!username) return "User not logged in.";
  const profileData = {
    user_id: data?.user.id,
    username: username,
    email: data.user.email!, // Assert that email is not null or undefined
    secret_message: message,
    created_at: data?.user.created_at,
    updated_at: new Date().toISOString(),
  };
  console.log("profile data : ", profileData);
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profileData, { onConflict: "email" })
      .select("secret_message");

    console.log("user id : ", user.data.user.id);
    if (error) {
      console.error("Error upserting secret message:", error);
      return "Failed to upsert message.";
    }
    console.log("Secret message : ", data);
    return "Secret message upserted successfully!";
  } catch (error) {
    console.error("Unexpected error upserting secret message:", error);
    return "Failed to upsert message.";
  }
};

// Fetch user profile (mainly for secret message)
export const getUserProfile = async (userId: string) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("secret_message")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      return null;
    }
    return data?.secret_message || null;
  } catch (error) {
    console.error("Unexpected error fetching user profile:", error);
    return null;
  }
};

// Fetch all friends' user IDs
export const getUserFriends = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from("friendships")
      .select("user_id, friend_id")
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .eq("status", "accepted");

    if (error) {
      console.error("Error fetching friends:", error);
      return [];
    }

    // Extract user_ids and friend_ids for both sides of the friendship
    const friends =
      data?.map((f) => (f.user_id === user.id ? f.friend_id : f.user_id)) || [];

    console.log("friends : ", friends);

    return friends;
  } catch (error) {
    console.error("Unexpected error fetching user friends:", error);
    return [];
  }
};

// Fetch friends' secret messages
export const getFriendsSecretMessages = async () => {
  const supabase = await createClient();
  const friendIds = await getUserFriends();
  if (friendIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, secret_message")
      .in("user_id", friendIds);

    if (error) {
      console.error("Error fetching friend secret messages:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching friends' messages:", error);
    return [];
  }
};

// Fetch user's username
export const getUserName = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching username:", error);
      return null;
    }
    return data?.username || null;
  } catch (error) {
    console.error("Unexpected error fetching username:", error);
    return null;
  }
};

// Handle account deletion
export const handleDeleteAccount = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    console.error("User not logged in");
    return null;
  }

  try {
    const { error } = await supabase.rpc("delete_own_account");
    if (error) {
      console.error("Error deleting user:", error);
      return null;
    }
    await supabase.auth.signOut();
    return "Account successfully deleted";
  } catch (error) {
    console.error("Unexpected error deleting account:", error);
    return null;
  }
};

// FOR FRIENDSHIPS

// Fetch pending friend requests
export const getPendingFriendRequests = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return [];

  try {
    // Step 1: Fetch user_id from the friendships table where friend_id is the current user's id and status is pending
    const { data, error } = await supabase
      .from("friendships")
      .select("user_id") // Fetch the user_id of the sender (the user who made the request)
      .eq("friend_id", user.id) // This checks for requests sent to the current user
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching pending friend requests:", error);
      return [];
    }

    // Step 2: Extract user_ids from the previous query
    const userIds = data?.map((req) => req.user_id) || [];

    // Step 3: Fetch the usernames for each user_id from the profiles table
    const { data: usernamesData, error: usernamesError } = await supabase
      .from("profiles")
      .select("username") // Fetch usernames based on user_id
      .in("user_id", userIds); // Only fetch usernames for user_ids in the list

    if (usernamesError) {
      console.error("Error fetching usernames:", usernamesError);
      return [];
    }

    // Step 4: Extract the usernames
    const usernames = usernamesData?.map((profile) => profile.username) || [];

    console.log("Pending Friend Requests Usernames:", usernames);

    return usernames; // Return only the usernames
  } catch (error) {
    console.error("Unexpected error fetching pending requests:", error);
    return [];
  }
};

//send friend request
export const sendFriendRequest = async (friendId: string) => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return null;

  // 🔹 Check if a friendship already exists
  const { data: existingFriendship, error: friendshipError } = await supabase
    .from("friendships")
    .select("id, status")
    .or(
      `and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`
    )
    .single();

  if (friendshipError && friendshipError.code !== "PGRST116") {
    // Ignore "PGRST116" (no rows found) since it means the friendship doesn't exist
    console.error("Error checking friendship:", friendshipError);
    return null;
  }

  // If the friendship already exists and the status is "confirmed", return that
  if (existingFriendship && existingFriendship.status === "confirmed") {
    console.log("You are already friends with this user.");
    return "You are already friends with this user.";
  }

  // If there's a pending request, prevent sending a new one
  if (existingFriendship && existingFriendship.status === "pending") {
    console.log("Friend request is already pending.");
    return "Friend request is already pending.";
  }

  // 🔹 Insert the friend request
  try {
    const { data, error } = await supabase
      .from("friendships")
      .insert({
        user_id: user.id,
        friend_id: friendId,
        status: "pending", // Set status as "pending"
      })
      .select();

    if (error) {
      console.error("Error sending friend request:", error);
      return null;
    }

    console.log("data : ", data);
    return "Friend request sent successfully!";
  } catch (error) {
    console.error("Unexpected error sending friend request:", error);
    return null;
  }
};

export const acceptFriendRequest = async (friendUsername: string) => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return null;
  //fetch the friend's friend_id based on their username
  const { data: friendData, error: friendError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("username", friendUsername)
    .single();

  if (friendError) {
    console.error("Error fetching friend's user_id:", friendError);
    return null;
  }
  if (!friendData || !friendData.user_id) {
    console.error("Friend not found");
    return null;
  }
  console.log("friendData : ", friendData);
  //fetch current user's user_id

  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user's user_id:", userError);
    return null;
  }

  if (!userData || !userData.user_id) {
    console.error("User not found");
    return null;
  }

  try {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("friend_id", userData.user_id);
    console.log("Current user's friend_id : ", userData.user_id);
    if (error) {
      console.error("Error accepting friend request:", error);
      return null;
    }
    return "Friend request accepted successfully!";
  } catch (error) {
    console.error("Unexpected error accepting friend request:", error);
    return null;
  }
};
