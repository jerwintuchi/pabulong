// app/types/definitions.ts
import { User } from "@supabase/supabase-js";
import { Dispatch } from "react";

export interface UserType {
  user: User | null;
  username: string | null;
  secretMessage: string | null | undefined;
  friends: Friend[];
  pendingRequests: (string | null)[];
}
export interface Friend {
  user_id: string | null;
  secret_message: string | null;
}

export type Action =
  | { type: "SET_USER"; payload: Partial<UserType> }
  | { type: "CLEAR_USER"; payload: Partial<UserType> }
  | { type: "SET_LOADING"; payload: boolean };

export type serviceRoleKey = string;

export type DeleteAccountResponse = {
  // Modify response structure if updated
  success: boolean;
};

export type EventChannels = "secret-message-updated";

export interface EventChannelsParams {
  channelName: EventChannels;
  user: UserType;
  dispatch: Dispatch<Action>;
}
