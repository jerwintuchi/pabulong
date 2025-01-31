// utils/auth.js

import { createClient } from "@/utils/supabase/server";

export const getUserAuthState = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};
