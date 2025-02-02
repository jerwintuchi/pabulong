"use client";
import React from "react";
import { useUser } from "@/contexts/UserContext";

const SecretPage2 = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <p className="text-center text-gray-500">Loading user data...</p>;
  }

  return (
    <div>
      <h1>Secret Page 2</h1>
      <p>Username: {user?.username}</p>
      <p>Secret Message: {user?.secretMessage}</p>
      {/* Display other user data */}
    </div>
  );
};

export default SecretPage2;
