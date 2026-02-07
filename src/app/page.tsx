'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await createClient().auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    };
    checkSession();
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
};