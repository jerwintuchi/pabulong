"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { getSecretMessage, updateSecretMessage } from "@/utils/queries/queryDefinitions";
import { useActionState } from "react";
import { SubmitButton } from "@/components/buttons/submit-button";

const SecretPage2 = () => {
  const { user, loading } = useUser();
  const [secretMessage, setSecretMessage] = useState(user?.secretMessage || "");


  const [status, formAction] = useActionState(updateSecretMessage, null);

  // Fetch latest secret message
  useEffect(() => {
    const fetchSecretMessage = async () => {
      try {
        const message = await getSecretMessage();
        setSecretMessage(message || "");
      } catch (error) {
        console.error("Error fetching secret message:", error);
      }
    };

    if (!secretMessage) {
      fetchSecretMessage();
    }
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading user data...</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 mt-10">
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 text-center">
        Secret Page 2
      </h1>
      <p className="text-center text-gray-500 pb-4">Username: {user?.username}</p>
      <div className="text-sm text-gray-200 p-4 border border-zinc-50 rounded-sm">
        My Secret Message:
        <span className="text-teal-400 pl-2">{secretMessage || "No message yet."}</span>
      </div>
      <form action={formAction} className="mt-12">
        <label htmlFor="message" className="block text-sm font-medium">
          Update Secret Message:
        </label>
        <textarea
          name="message"
          id="message"
          defaultValue={secretMessage}
          className="w-full p-2 border rounded mt-1"
          required
        />
        <SubmitButton className="mt-3 bg-blue-600 text-white py-2 px-4 rounded">
          {secretMessage ? "Update Message" : "Add Message"}
        </SubmitButton>
      </form>

      {status && <p className="mt-3 text-center text-sm text-gray-600">{status}</p>}
    </div>
  );
};

export default SecretPage2;
