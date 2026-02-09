import { User } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[var(--background-subtle)]">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
                    <p className="text-muted-foreground">Manage your account</p>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--border-subtle)] p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Profile Settings Coming Soon!
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        You&apos;ll be able to update your profile picture, change your name, and manage your learning preferences.
                    </p>
                </div>
            </div>
        </div>
    );
}
