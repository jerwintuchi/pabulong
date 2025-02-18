import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { resetPasswordAction } from "@/app/actions";
import * as utils from "@/utils/utils";

// Create mock for updateUser
const updateUserMock = vi.fn();

// Setup the supabase client mock
vi.mock("@/utils/supabase/server", () => ({
  createClient: () => ({
    auth: {
      updateUser: updateUserMock,
    },
  }),
}));

// Handle the encodedRedirect differently since it has a 'never' return type
vi.mock("@/utils/utils", () => ({
  encodedRedirect: vi.fn().mockImplementation(() => {
    // This prevents the function from returning by throwing
    // an error that we'll catch in our tests
    throw new Error("Redirect occurred");
  }),
}));

describe("resetPasswordAction", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it("should return error when password is missing", async () => {
    // Create FormData without password
    const formData = new FormData();
    formData.append("confirmPassword", "newpassword123");

    // We expect this to throw since encodedRedirect throws
    await expect(resetPasswordAction(formData)).rejects.toThrow(
      "Redirect occurred"
    );

    // Check that encodedRedirect was called with correct args
    expect(utils.encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
    expect(updateUserMock).not.toHaveBeenCalled();
  });

  it("should return error when confirmPassword is missing", async () => {
    // Create FormData without confirmPassword
    const formData = new FormData();
    formData.append("password", "newpassword123");

    await expect(resetPasswordAction(formData)).rejects.toThrow(
      "Redirect occurred"
    );

    expect(utils.encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
    expect(updateUserMock).not.toHaveBeenCalled();
  });

  it("should return error when passwords do not match", async () => {
    // Create FormData with non-matching passwords
    const formData = new FormData();
    formData.append("password", "newpassword123");
    formData.append("confirmPassword", "differentpassword");

    await expect(resetPasswordAction(formData)).rejects.toThrow(
      "Redirect occurred"
    );

    expect(utils.encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/reset-password",
      "Passwords do not match"
    );
    expect(updateUserMock).not.toHaveBeenCalled();
  });

  it("should call updateUser with correct password when inputs are valid", async () => {
    // Setup successful response
    updateUserMock.mockResolvedValueOnce({ error: null });

    // Create FormData with matching passwords
    const formData = new FormData();
    formData.append("password", "newpassword123");
    formData.append("confirmPassword", "newpassword123");

    await expect(resetPasswordAction(formData)).rejects.toThrow(
      "Redirect occurred"
    );

    expect(updateUserMock).toHaveBeenCalledWith({
      password: "newpassword123",
    });

    expect(utils.encodedRedirect).toHaveBeenCalledWith(
      "success",
      "/reset-password",
      "Password updated"
    );
  });

  it("should return error when password update fails", async () => {
    // Setup error response
    updateUserMock.mockResolvedValueOnce({
      error: { message: "Password update failed" },
    });

    // Create FormData with matching passwords
    const formData = new FormData();
    formData.append("password", "newpassword123");
    formData.append("confirmPassword", "newpassword123");

    await expect(resetPasswordAction(formData)).rejects.toThrow(
      "Redirect occurred"
    );

    expect(utils.encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/reset-password",
      "Password update failed"
    );
  });
});
