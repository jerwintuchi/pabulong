"use server";

import { createClient } from "@/utils/supabase/server"; // Server-side Supabase client
import {
  getUserName,
  getSecretMessage,
  getUserFriends,
  getPendingFriendRequests,
  getFriendsSecretMessages,
} from "../queries/queryDefinitions";

export async function getServerUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Fetch additional user data from the database
  const [
    username,
    secretMessage,
    friendsRaw,
    pendingRequests,
    friendsSecretMessages,
  ] = await Promise.all([
    getUserName(),
    getSecretMessage(),
    getUserFriends(),
    getPendingFriendRequests(),
    getFriendsSecretMessages(),
  ]);

  const friends = friendsRaw.map((friendId: string | null) => ({
    user_id: friendId,
    secret_message: null,
  }));

  const friendsWithMessages = friends.map((friend) => {
    const matchingMessage = friendsSecretMessages.find(
      (f) => f.user_id === friend.user_id
    );
    return {
      ...friend,
      secret_message: matchingMessage ? matchingMessage.secret_message : null,
    };
  });

  return {
    user: user,
    username,
    secretMessage,
    friends: friendsWithMessages,
    pendingRequests,
  };
}
