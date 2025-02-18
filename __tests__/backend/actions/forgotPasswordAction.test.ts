import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { forgotPasswordAction } from "@/app/actions";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";

// Mock the dependencies
vi.mock("@/utils/utils", () => ({
  encodedRedirect: vi.fn((type, path, message) => ({ type, path, message })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url) => ({ url })),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn((key) => (key === "origin" ? "https://example.com" : null)),
  })),
}));

// Mock Supabase client
const mockResetPasswordForEmail = vi.fn();
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  })),
}));

describe("forgotPasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error when email is missing", async () => {
    // Create FormData without email
    const formData = new FormData();

    const result = await forgotPasswordAction(formData);

    expect(encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/forgot-password",
      "Email is required"
    );
    expect(mockResetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("should call resetPasswordForEmail with correct parameters", async () => {
    // Setup successful response
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: null });

    // Create FormData with email
    const formData = new FormData();
    formData.append("email", "test@example.com");

    await forgotPasswordAction(formData);

    expect(mockResetPasswordForEmail).toHaveBeenCalledWith("test@example.com", {
      redirectTo:
        "https://example.com/auth/callback?redirect_to=/reset-password",
    });
  });

  it("should return error when resetPasswordForEmail fails", async () => {
    // Setup error response
    mockResetPasswordForEmail.mockResolvedValueOnce({
      error: { message: "Invalid email" },
    });

    // Create FormData with email
    const formData = new FormData();
    formData.append("email", "invalid@example.com");

    await forgotPasswordAction(formData);

    expect(encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  });

  it("should redirect to callback URL if provided", async () => {
    // Setup successful response
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: null });

    // Create FormData with email and callback URL
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("callbackUrl", "/login?reset=true");

    const result = await forgotPasswordAction(formData);

    expect(redirect).toHaveBeenCalledWith("/login?reset=true");
  });

  it("should return success message when reset is successful and no callback URL", async () => {
    // Setup successful response
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: null });

    // Create FormData with email only
    const formData = new FormData();
    formData.append("email", "test@example.com");

    await forgotPasswordAction(formData);

    expect(encodedRedirect).toHaveBeenCalledWith(
      "success",
      "/forgot-password",
      "Check your email for a link to reset your password."
    );
  });
});
