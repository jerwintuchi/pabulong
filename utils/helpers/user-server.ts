// utils/helpers/user-server.ts
"use server";
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import {
  getUserName,
  getSecretMessage,
  getUserFriends,
  getPendingFriendRequests,
  getFriendsSecretMessages,
} from "../queries/queryDefinitions";

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

export interface UserDataOptions {
  includeSecretMessage?: boolean;
  includeFriends?: boolean;
  includePendingRequests?: boolean;
  includeFriendsMessages?: boolean;
}

// Optimized function to fetch user data with parallel requests
export async function getServerUser(options: UserDataOptions = {}) {
  const [user, username] = await Promise.all([
    getBasicUser(),
    getCachedUsername(),
  ]);

  if (!user) return null;

  const userData: any = {
    user,
    username,
  };

  // Create an array of promises for parallel execution
  const promises = [];

  if (options.includeSecretMessage) {
    promises.push(
      getSecretMessage().then((message) => {
        userData.secretMessage = message;
      })
    );
  }

  if (options.includeFriends || options.includeFriendsMessages) {
    promises.push(
      getUserFriends().then((friendsRaw) => {
        userData.friends = friendsRaw.map((friendId: string | null) => ({
          user_id: friendId,
          secret_message: null,
        }));
      })
    );
  }

  if (options.includePendingRequests) {
    promises.push(
      getPendingFriendRequests().then((requests) => {
        userData.pendingRequests = requests;
      })
    );
  }

  // Wait for all promises to resolve
  await Promise.all(promises);

  // Get friends messages separately if needed (depends on friends data)
  if (options.includeFriendsMessages && userData.friends) {
    const friendsMessages = await getFriendsSecretMessages();
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

  return userData;
}
