"use client";
import React from "react";
import { useUser } from "@/contexts/UserContext";

const SecretPage2 = () => {
  const userData = useUser();  // Access user data from context

  if (!userData) {
    return <div>Loading...</div>;  // Optionally handle loading state
  }

  return (
    <div>
      <h1>Secret Page 2</h1>
      <p>Username: {userData.username}</p>
      <p>Secret Message: {userData.secretMessage}</p>
      {/* Display other user data */}
    </div>
  );
};

export default SecretPage2;
