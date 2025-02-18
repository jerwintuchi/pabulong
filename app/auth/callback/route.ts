import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  console.log("origin ", origin);
  if (code) {
    const supabase = await createClient();

    // Exchange the auth code for a session (grants the user an auth session)
    await supabase.auth.exchangeCodeForSession(code);

    // Fetch authenticated user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Auth error:", error?.message);
      return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
    }

    // Extract username from user metadata
    const username =
      user.user_metadata?.username || `user_${user.id.substring(0, 6)}`;

    // Check if the user exists in the profiles table
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!existingProfile) {
      // Insert user into profiles table
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          user_id: user.id,
          username: username,
          email: user.email!,
        },
      ]);

      if (insertError) {
        console.error("Profile insert error:", insertError.message);
        return NextResponse.redirect(
          `${origin}/sign-in?error=profile_insert_failed`
        );
      }
    }
  }

  return NextResponse.redirect(
    redirectTo ? `${origin}${redirectTo}` : `${origin}/`
  );
}
