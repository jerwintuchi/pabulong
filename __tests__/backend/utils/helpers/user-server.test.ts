import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getBasicUser,
  getCachedUsername,
  getServerUser,
} from "@/utils/helpers/user-server";
import { createClient } from "@/utils/supabase/server";
import * as queryDefinitions from "@/utils/queries/queryDefinitions";

// Mock the modules
vi.mock("@/utils/supabase/server");

// Mock all query functions
vi.mock("@/utils/queries/queryDefinitions", () => ({
  getUserName: vi.fn(),
  getSecretMessage: vi.fn(),
  getUserFriends: vi.fn(),
  getPendingFriendRequests: vi.fn(),
  getFriendsSecretMessages: vi.fn(),
}));

describe("User Server Functions", () => {
  const mockUser = { id: "123", email: "test@example.com" };
  const mockUsername = "testuser";

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(queryDefinitions.getUserName).mockResolvedValue(mockUsername);
    vi.mocked(queryDefinitions.getSecretMessage).mockResolvedValue("secret");
    vi.mocked(queryDefinitions.getUserFriends).mockResolvedValue([
      "friend1",
      "friend2",
    ]);
    vi.mocked(queryDefinitions.getPendingFriendRequests).mockResolvedValue([
      "pending1",
    ]);
    vi.mocked(queryDefinitions.getFriendsSecretMessages).mockResolvedValue([
      { user_id: "friend1", secret_message: "friend1secret" },
      { user_id: "friend2", secret_message: "friend2secret" },
    ]);

    // Mock Supabase client
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    } as any);
  });

  describe("getBasicUser", () => {
    it("should return user when authentication succeeds", async () => {
      const result = await getBasicUser();
      expect(result).toEqual(mockUser);
      expect(createClient).toHaveBeenCalled();
    });

    it("should return null when authentication fails", async () => {
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: new Error("Auth failed"),
          }),
        },
      } as any);

      const result = await getBasicUser();
      expect(result).toBeNull();
    });
  });

  describe("getCachedUsername", () => {
    it("should return username", async () => {
      const result = await getCachedUsername();
      expect(result).toBe(mockUsername);
      expect(queryDefinitions.getUserName).toHaveBeenCalled();
    });
  });

  describe("getServerUser", () => {
    it("should return null if user is not authenticated", async () => {
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi
            .fn()
            .mockResolvedValue({ data: { user: null }, error: null }),
        },
      } as any);

      const result = await getServerUser();
      expect(result).toBeNull();
    });

    it("should return basic user data by default", async () => {
      const result = await getServerUser();
      expect(result).toEqual({
        user: mockUser,
        username: mockUsername,
      });
    });

    it("should include secret message when requested", async () => {
      const result = await getServerUser({ includeSecretMessage: true });
      expect(result).toEqual({
        user: mockUser,
        username: mockUsername,
        secretMessage: "secret",
      });
      expect(queryDefinitions.getSecretMessage).toHaveBeenCalled();
    });

    it("should include friends when requested", async () => {
      const result = await getServerUser({ includeFriends: true });
      expect(result.friends).toEqual([
        { user_id: "friend1", secret_message: null },
        { user_id: "friend2", secret_message: null },
      ]);
      expect(queryDefinitions.getUserFriends).toHaveBeenCalled();
    });

    it("should include friends messages when requested", async () => {
      const result = await getServerUser({
        includeFriends: true,
        includeFriendsMessages: true,
      });
      expect(result.friends).toEqual([
        { user_id: "friend1", secret_message: "friend1secret" },
        { user_id: "friend2", secret_message: "friend2secret" },
      ]);
      expect(queryDefinitions.getUserFriends).toHaveBeenCalled();
      expect(queryDefinitions.getFriendsSecretMessages).toHaveBeenCalled();
    });

    it("should include pending requests when requested", async () => {
      const result = await getServerUser({ includePendingRequests: true });
      expect(result.pendingRequests).toEqual(["pending1"]);
      expect(queryDefinitions.getPendingFriendRequests).toHaveBeenCalled();
    });

    it("should handle all options together", async () => {
      const result = await getServerUser({
        includeSecretMessage: true,
        includeFriends: true,
        includeFriendsMessages: true,
        includePendingRequests: true,
      });

      expect(result).toEqual({
        user: mockUser,
        username: mockUsername,
        secretMessage: "secret",
        friends: [
          { user_id: "friend1", secret_message: "friend1secret" },
          { user_id: "friend2", secret_message: "friend2secret" },
        ],
        pendingRequests: ["pending1"],
      });
    });
  });
});
