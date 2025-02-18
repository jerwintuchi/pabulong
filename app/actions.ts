"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const username = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  console.log("Sign-Up Attempt:", { username, email });

  if (!username) {
    console.log("Missing Username");
    return encodedRedirect("error", "/sign-up", "Username is required");
  }

  //  Check if username already exists
  const { data: isUsernameAvailable, error: usernameError } =
    await supabase.rpc("check_username_availability", {
      user_username: username,
    });

  console.log("🔍 Username Availability Check:", {
    isUsernameAvailable,
    usernameError,
  });

  if (usernameError) {
    console.error("Error checking username:", usernameError);
    return encodedRedirect(
      "error",
      "/sign-up",
      "An error occurred, please try again."
    );
  }

  if (!isUsernameAvailable) {
    console.log("Username already exists");
    return encodedRedirect(
      "error",
      "/sign-up",
      "That username is already taken, try another one."
    );
  }

  if (!email || !password) {
    console.log("Missing Email or Password");
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  if (username.length > 12) {
    console.log("Username Too Long");
    return encodedRedirect(
      "error",
      "/sign-up",
      "Username must be 12 characters or less"
    );
  }

  // Check if email already exists in profiles
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  console.log("🔍 Email Check in Profiles:", { existingProfile, profileError });

  if (existingProfile) {
    console.log("Email already exists in profiles");
    return encodedRedirect(
      "error",
      "/sign-up",
      "That email is already taken, try another one."
    );
  }

  //  Check if email exists in auth.users
  const { data: existingUser, error: existingUserError } = await supabase.rpc(
    "check_existing_email",
    { user_email: email }
  );

  console.log("🔍 Email Check in auth.users:", {
    existingUser,
    existingUserError,
  });

  if (existingUser) {
    console.log("Email already exists in auth.users");
    return encodedRedirect(
      "error",
      "/sign-up",
      "That email is already taken, try another one."
    );
  }

  // Try signing up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { username },
    },
  });

  console.log("🔍 Supabase Sign-Up Response:", { data, error });

  if (error) {
    console.log("Supabase Sign-Up Error:", error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  console.log("Sign-Up Successful");
  return encodedRedirect(
    "success",
    "/sign-up",
    "Please check your email for a verification link."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/reset-password", "Password update failed");
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
