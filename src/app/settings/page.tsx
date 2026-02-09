import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-[var(--background-subtle)]">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                    <p className="text-muted-foreground">Customize your experience</p>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--border-subtle)] p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl flex items-center justify-center">
                        <Settings className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Settings Coming Soon!
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        You&apos;ll be able to customize notifications, appearance, and accessibility options.
                    </p>
                </div>
            </div>
        </div>
    );
}
