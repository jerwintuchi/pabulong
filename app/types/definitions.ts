import { User } from "@supabase/supabase-js";

export interface UserType {
  user: User | null;
  username: string | null;
  secretMessage: string | null;
  friends: { user_id: string | null; secret_message: string | null }[];
  pendingRequests: string[];
}
