import { cookies } from "next/headers";
import { profiles } from "./mock-data";
import type { Profile } from "./types";

/**
 * Mock auth: reads `mock_user_id` cookie to determine the current user.
 * In production, this will be replaced with Supabase Auth.
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("mock_user_id")?.value;
  if (!userId) return null;
  return profiles.find((p) => p.id === userId) ?? null;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}
