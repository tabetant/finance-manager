import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calculator, Video } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock Data (Replace with DB fetch later)
const COURSES = {
    "calculus": {
        title: "Calculus",
        description: "Explore the mathematics of change and motion.",
        icon: Calculator,
        modules: [
            { id: "limits", title: "Limits and Continuity", order: 1, type: "reading" },
            { id: "derivatives", title: "Derivatives", order: 2, type: "video" },
            { id: "optimization", title: "Optimization Problems", order: 3, type: "reading" },
            { id: "integration", title: "Integration", order: 4, type: "video" },
        ]
    },
    "linear-algebra": {
        title: "Linear Algebra",
        description: "Understand vector spaces and linear mappings.",
        icon: Activity, // Placeholder, need to import Activity or similar
        modules: [
            { id: "vectors", title: "Vectors and Spaces", order: 1, type: "reading" },
            { id: "gaussian", title: "Gaussian Elimination", order: 2, type: "video" },
            { id: "matrix-algebra", title: "Matrix Algebra", order: 3, type: "reading" },
            { id: "eigenvectors", title: "Eigenvectors and Eigenvalues", order: 4, type: "video" },
        ]
    }
} as const;

import { Activity } from "lucide-react";

export default function CoursePage({ params }: { params: { courseId: string } }) {
    const courseId = params.courseId;
    const course = COURSES[courseId as keyof typeof COURSES];

    if (!course) {
        return notFound();
    }

    const Icon = course.icon;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary mb-4 block">
                    &larr; Back to Dashboard
                </Link>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
                        <p className="text-muted-foreground text-lg">{course.description}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {course.modules.map((module) => (
                    <Card key={module.id} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold">
                                {module.order}. {module.title}
                            </CardTitle>
                            {module.type === 'video' ? <Video className="w-5 h-5 text-muted-foreground" /> : <BookOpen className="w-5 h-5 text-muted-foreground" />}
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Master the concepts of {module.title.toLowerCase()} through our curated multimodal content.
                            </CardDescription>
                            <Link href={`/courses/${courseId}/${module.id}`}>
                                <Button className="w-full sm:w-auto group-hover:bg-primary group-hover:text-primary-foreground">
                                    Start Module <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
