"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  address: string;
  city: string;
  created_at: string;
  updated_at: string;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        return;
      }
      setProfile(data);
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
      setLoading(false);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign up
  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        // Validate inputs
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = fullName.trim();

        if (!cleanEmail || !password || !cleanName) {
          return { error: "All fields are required" };
        }
        if (password.length < 6) {
          return { error: "Password must be at least 6 characters" };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          return { error: "Invalid email address" };
        }
        if (cleanName.length < 2) {
          return { error: "Name must be at least 2 characters" };
        }

        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanName },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            return { error: "An account with this email already exists" };
          }
          return { error: error.message };
        }

        return {};
      } catch {
        return { error: "An unexpected error occurred" };
      }
    },
    []
  );

  // Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail || !password) {
        return { error: "Email and password are required" };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login")) {
          return { error: "Invalid email or password" };
        }
        return { error: error.message };
      }

      return {};
    } catch {
      return { error: "An unexpected error occurred" };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) return { error: "Not signed in" };

      try {
        // Sanitize inputs
        const sanitized: Record<string, string> = {};
        if (updates.full_name !== undefined) {
          sanitized.full_name = updates.full_name.trim().slice(0, 100);
        }
        if (updates.phone !== undefined) {
          sanitized.phone = updates.phone.replace(/[^0-9+\-\s()]/g, "").slice(0, 20);
        }
        if (updates.address !== undefined) {
          sanitized.address = updates.address.trim().slice(0, 200);
        }
        if (updates.city !== undefined) {
          sanitized.city = updates.city.trim().slice(0, 50);
        }
        if (updates.avatar_url !== undefined) {
          sanitized.avatar_url = updates.avatar_url.trim().slice(0, 500);
        }
        sanitized.updated_at = new Date().toISOString();

        const { error } = await supabase
          .from("profiles")
          .update(sanitized)
          .eq("id", user.id);

        if (error) return { error: error.message };

        await fetchProfile(user.id);
        return {};
      } catch {
        return { error: "Failed to update profile" };
      }
    },
    [user, fetchProfile]
  );

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
