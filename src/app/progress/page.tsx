import { GraduationCap, TrendingUp, Award } from "lucide-react";

export default function ProgressPage() {
    return (
        <div className="min-h-screen bg-[var(--background-subtle)]">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Progress</h1>
                    <p className="text-muted-foreground">Track your learning journey</p>
                </div>

                {/* Coming Soon State */}
                <div className="bg-white rounded-2xl border border-[var(--border-subtle)] p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Progress Tracking Coming Soon!
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        We&apos;re building a comprehensive progress tracking system that will show your course completion, quiz scores, and learning streaks.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                        <div className="p-4 bg-[var(--background-subtle)] rounded-xl">
                            <GraduationCap className="w-6 h-6 text-primary mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Course Completion</p>
                        </div>
                        <div className="p-4 bg-[var(--background-subtle)] rounded-xl">
                            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Learning Analytics</p>
                        </div>
                        <div className="p-4 bg-[var(--background-subtle)] rounded-xl">
                            <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Achievements</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
