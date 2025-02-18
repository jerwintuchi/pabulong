import { mockSupabase } from "../../__mocks__/supabase";
import "../../__mocks__/nextHeaders";
import { signInAction } from "@/app/actions";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/utils/utils", () => ({
  encodedRedirect: vi.fn((type, path, message) => ({ type, path, message })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("signInAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return error if authentication fails", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      error: { message: "Invalid credentials" },
    });

    const formData = new FormData();
    formData.set("email", "wrong@example.com");
    formData.set("password", "wrongpassword");

    const response = await signInAction(formData);
    expect(response).toEqual({
      type: "error",
      path: "/sign-in",
      message: "Invalid credentials",
    });
  });

  test("should redirect to index on successful sign-in", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({ error: null });

    const formData = new FormData();
    formData.set("email", "correct@example.com");
    formData.set("password", "correctpassword");

    const response = await signInAction(formData);
    expect(response).toBeUndefined(); // Redirect happens internally
  });
});
