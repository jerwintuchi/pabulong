import { vi } from "vitest";

export const mockCookies = vi.fn(() => ({
  getAll: vi.fn(() => []),
  set: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: mockCookies,
  headers: vi.fn(() => new Headers()),
}));
