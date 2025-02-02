"use server";

import { createClient } from "../supabase/server";
export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const getSecretMessage = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("secret_message")
      .eq("user_id", user.id)
      .single();
    return data?.secret_message;
  } catch (error) {
    console.error("Error fetching secret message:", error);
    return null;
  }
};

// Function to fetch user profile
export const getUserProfile = async (userId: string) => {
  const supabase = await createClient();

  try {
    // Make sure your logic here properly fetches the profile.
    // Example fetch from database or API:
    const { data, error } = await supabase
      .from("profiles")
      .select("secret_message")
      .eq("user_id", userId)
      .single(); // This ensures only one row is returned

    if (error) {
      throw new Error(`Error fetching profile: ${error.message}`);
    }

    return data ? data.secret_message : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Function to fetch user friends
export const getUserFriends = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    return [];
  }
  const { data, error } = await supabase
    .from("friendships")
    .select("friend_id, status")
    .eq("user_id", user?.id);

  if (error) {
    console.error("Error fetching friends:", error);
    return [];
  }

  return (
    data?.filter((f) => f.status === "accepted").map((f) => f.friend_id) || []
  );
};

// Function to fetch friends' secret messages
export const getFriendsSecretMessages = async () => {
  const supabase = await createClient();
  const friendIds = await getUserFriends();
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, secret_message")
    .in("user_id", friendIds);

  if (error) {
    console.error("Error fetching friend secret messages:", error);
    return [];
  }

  return data || [];
};

// Function to fetch pending friend requests
export const getPendingFriendRequests = async () => {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    throw new Error("User not logged in");
  }
  const { data, error } = await supabase
    .from("friendships")
    .select("user_id")
    .eq("friend_id", user?.id)
    .eq("status", "pending");

  if (error) {
    console.log("Error fetching pending friend requests:", error);
    return [];
  }

  return data?.map((req) => req.user_id) || [];
};

export const getUserName = async () => {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    throw new Error("User not logged in");
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", user?.id)
    .single();

  if (error) {
    console.error("Error fetching username:", error);
    return null;
  }

  return data ? data.username : null;
};

export const handleDeleteAccount = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    console.error("User not logged in");
    throw new Error("User not logged in");
  }
  try {
    let { data, error } = await supabase.rpc("delete_own_account");

    if (error) {
      console.error(
        "Error deleting user....",
        "ERROR CODE: " + error.code,
        " ERROR MESSAGE: ",
        error.message
      );
    } else {
      console.log("Account successfully deleted - ", data);
    }
  } catch (error) {
    console.error("Cannot delete user", error);
  }

  await supabase.auth.signOut();
};
