// app/types/definitions.ts
import { Action } from "@/contexts/UserContext";
import { User } from "@supabase/supabase-js";
import { Dispatch } from "react";

export interface UserType {
  user: User | null;
  username: string | null;
  secretMessage: string | null | undefined;
  friends: { user_id: string | null; secret_message: string | null }[];
  pendingRequests: (string | null)[];
}

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
