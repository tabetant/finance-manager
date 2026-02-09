import { FileText, Download, Video } from "lucide-react";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-[var(--background-subtle)]">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Resources</h1>
                    <p className="text-muted-foreground">Supplemental learning materials</p>
                </div>

                {/* Coming Soon State */}
                <div className="bg-white rounded-2xl border border-[var(--border-subtle)] p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl flex items-center justify-center">
                        <FileText className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Resources Coming Soon!
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        We&apos;re preparing downloadable PDFs, supplemental videos, and study guides for all modules.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                        <div className="p-4 bg-[var(--background-subtle)] rounded-xl">
                            <FileText className="w-6 h-6 text-accent mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">PDF Downloads</p>
                        </div>
                        <div className="p-4 bg-[var(--background-subtle)] rounded-xl">
                            <Video className="w-6 h-6 text-accent mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Video Lectures</p>
                        </div>
                        <div className="p-4 bg-[var(--background-subtle)] rounded-xl">
                            <Download className="w-6 h-6 text-accent mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Study Guides</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
