import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/shared/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { AuthContext } from "./context";
import type { AuthUser, AuthContextType, Role } from "@/shared/types/app";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, phone: string): Promise<AuthUser | null> => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            phone,
            age_verified: false,
            role: "customer",
          })
          .select()
          .single();

        if (insertError) throw insertError;

        return {
          id: newProfile.id,
          phone: newProfile.phone,
          fullName: newProfile.full_name,
          ageVerified: newProfile.age_verified,
          role: newProfile.role as Role,
        };
      }

      if (error) throw error;

      return {
        id: profile.id,
        phone: profile.phone,
        fullName: profile.full_name,
        ageVerified: profile.age_verified,
        role: profile.role as Role,
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const refreshUser = async () => {
    if (!session?.user) return;

    const profile = await fetchUserProfile(session.user.id, session.user.phone || "");

    if (profile) {
      setUser(profile);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.phone || "").then((profile) => {
          setUser(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id, session.user.phone || "");
        setUser(profile);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithOtp = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: "sms",
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { error: error as Error };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) {
      return { error: new Error("No user logged in") };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: updates.fullName,
          age_verified: updates.ageVerified,
          role: updates.role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });

      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithOtp,
    verifyOtp,
    signOut,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};