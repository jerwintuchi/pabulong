"use server";

import { createClient } from "@/utils/supabase/server";
import {
  getUserName,
  getSecretMessage,
  getUserFriends,
  getPendingFriendRequests,
  getFriendsSecretMessages,
} from "../queries/queryDefinitions";
import { cache } from "react";

// Cache the basic user authentication check
export const getBasicUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
});

// Cache username separately as it rarely changes
export const getCachedUsername = cache(async () => {
  return getUserName();
});

// Interface for specifying which data to fetch
export interface UserDataOptions {
  includeSecretMessage?: boolean;
  includeFriends?: boolean;
  includePendingRequests?: boolean;
  includeFriendsMessages?: boolean;
}

// Main function to fetch user data with options
export async function getServerUser(options: UserDataOptions = {}) {
  const user = await getBasicUser();
  if (!user) return null;

  const username = await getCachedUsername();

  const userData: any = {
    user,
    username,
  };

  // Get friends data first if we need either friends or their messages
  if (options.includeFriends || options.includeFriendsMessages) {
    const friendsRaw = await getUserFriends();
    userData.friends = friendsRaw.map((friendId: string | null) => ({
      user_id: friendId,
      secret_message: null,
    }));

    if (options.includeFriendsMessages) {
      const friendsMessages = await getFriendsSecretMessages();
      // Ensure  properly matching and assigning messages
      userData.friends = userData.friends.map((friend: any) => {
        const message = friendsMessages.find(
          (msg: any) => msg.user_id === friend.user_id
        );
        return {
          ...friend,
          secret_message: message ? message.secret_message : null,
        };
      });
    }
  }

  if (options.includeSecretMessage) {
    userData.secretMessage = await getSecretMessage();
  }

  if (options.includePendingRequests) {
    userData.pendingRequests = await getPendingFriendRequests();
  }

  return userData;
}
