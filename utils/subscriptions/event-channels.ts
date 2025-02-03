import { EventChannels } from "@/app/types/definitions";
// utils/subscriptions/event-channels.ts
import { Action } from "@/contexts/UserContext";
import { createClient } from "../supabase/client";

import { Dispatch } from "react";
import { User } from "@supabase/supabase-js";

interface EventChannelsParams {
  channelName: EventChannels;
  user: User;
  dispatch: Dispatch<Action>;
}

export async function executeEventChannel({
  channelName,
  user,
  dispatch,
}: EventChannelsParams) {
  const supabase = createClient();
  let isExecuted = false;

  try {
    const channel = supabase
      .channel(`${channelName}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedMessage = payload.new.secret_message;
          dispatch({
            type: "SET_USER",
            payload: { secretMessage: updatedMessage },
          });
        }
      )
      .subscribe();
    isExecuted = true;

    // Clean up the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.log(error);
  }

  return isExecuted;
}
