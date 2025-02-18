import { mockSupabase } from "../../__mocks__/supabase";
import "../../__mocks__/nextHeaders";
import { signUpAction } from "@/app/actions";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/utils/utils", () => ({
  encodedRedirect: vi.fn((type, path, message) => ({ type, path, message })),
}));

describe("signUpAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return error if username is missing", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "password123");

    const response = await signUpAction(formData);
    expect(response).toEqual({
      type: "error",
      path: "/sign-up",
      message: "Username is required",
    });
  });

  test("should return error if email already exists", async () => {
    mockSupabase.rpc.mockResolvedValueOnce({ data: true, error: null });

    const formData = new FormData();
    formData.set("username", "testuser");
    formData.set("email", "test@example.com");
    formData.set("password", "password123");

    const response = await signUpAction(formData);
    expect(response).toEqual({
      type: "error",
      path: "/sign-up",
      message: "Email already exists", // this is the response from the server not the frontend
    });
  });

  test("should successfully sign up a new user", async () => {
    mockSupabase.rpc.mockImplementation((procedureName) => {
      if (procedureName === "check_existing_email") {
        return Promise.resolve({ data: false, error: null }); // Email does NOT exist
      }
      if (procedureName === "check_username_availability") {
        return Promise.resolve({ data: true, error: null }); // Username IS available
      }
      return Promise.resolve({ data: null, error: null });
    });
    mockSupabase.auth.signUp.mockResolvedValueOnce({ data: {}, error: null });

    const formData = new FormData();
    formData.set("username", "newuser");
    formData.set("email", "new@example.com");
    formData.set("password", "password123");

    const response = await signUpAction(formData);
    expect(response).toEqual({
      type: "success",
      path: "/sign-up",
      message: "Please check your email for a verification link.",
    });
  });
});
