'use client';
import { useRouter } from "next/navigation";
import {
  supabase
} from "./db/client";
export default async function LandingPage() {
  const router = useRouter();
  const { data: { session } } = await supabase().auth.getSession();
  if (session) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
};