"use server";
import { createClient } from "../supabase/server";

// Fetch authenticated user
export const getUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data?.user || null;
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
    id: data?.user.id,
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
      .select("friend_id")
      .eq("user_id", user.id)
      .eq("status", "accepted");

    if (error) {
      console.error("Error fetching friends:", error);
      return [];
    }
    return data?.map((f) => f.friend_id) || [];
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

// Fetch pending friend requests
export const getPendingFriendRequests = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from("friendships")
      .select("user_id")
      .eq("friend_id", user.id)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching pending friend requests:", error);
      return [];
    }
    return data?.map((req) => req.user_id) || [];
  } catch (error) {
    console.error("Unexpected error fetching pending requests:", error);
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
