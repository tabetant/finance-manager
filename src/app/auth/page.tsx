import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import AuthForm from "@/components/auth/AuthForm"
import MultimodalShowcase from "@/components/auth/MultimodalShowcase"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
    title: "Authentication | WorldEd",
    description: "Login or Sign Up to access the Multimodal Learning Platform.",
}

export default function AuthenticationPage() {
    return (
        <>
            <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

                {/* Mobile Logo / Header */}
                <div className="absolute right-4 top-4 md:right-8 md:top-8 lg:hidden">
                    <Link
                        href="/auth"
                        className={cn(buttonVariants({ variant: "ghost" }), "text-[var(--worlded-blue)]")}
                    >
                        Login
                    </Link>
                </div>

                {/* Left Side: Multimodal Showcase (Hidden on Mobile) */}
                <div className="relative hidden h-full flex-col bg-muted text-white dark:border-r lg:flex">
                    <MultimodalShowcase />
                </div>

                {/* Right Side: Auth Form */}
                <div className="lg:p-8 flex h-full items-center justify-center bg-gray-50/50">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <AuthForm />
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    )
}
