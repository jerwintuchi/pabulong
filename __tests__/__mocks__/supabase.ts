import { vi } from "vitest";

export const mockSupabase = {
  auth: {
    signUp: vi.fn(async ({ email }) => {
      if (email === "test@example.com") {
        return { data: null, error: { message: "Email already exists" } };
      }
      return { data: {}, error: null };
    }),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    forgotPasswordAction: vi.fn(async () => ({ error: null })),
    resetPasswordForEmail: vi.fn(async () => ({ error: null })),
    updateUser: vi.fn(),
  },
  rpc: vi.fn(async (procedureName) => {
    if (procedureName === "check_existing_email") {
      return { data: false, error: null }; // Prevents destructuring error
    }
    if (procedureName === "check_username_availability") {
      return { data: true, error: null };
    }
    return { data: null, error: null };
  }),
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
};

// Mock the Supabase client
vi.mock("@/utils/supabase/server", () => ({
  createClient: () => mockSupabase,
}));
