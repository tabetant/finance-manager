'use client';
import { useRouter } from "next/navigation";
import {
  createClient
} from "@/utils/supabase/client";
export default async function LandingPage() {
  const router = useRouter();
  const { data: { session } } = await createClient().auth.getSession();
  if (session) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
};