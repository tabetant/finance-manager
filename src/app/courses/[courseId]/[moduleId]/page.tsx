import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, ExternalLink, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

// Mock Data (Replace with DB fetch later)
const MODULE_CONTENT = {
    "calculus": {
        "limits": {
            title: "Limits and Continuity",
            content: `
# Introduction to Limits

Limits are the backbone of calculus. They allow us to talk about the behavior of a function as its input approaches a certain value, even if the function isn't defined at that value.

## The Intuitive Idea

Imagine you're walking towards a door. You get halfway there, then half of the remaining distance, then half again. Will you ever reach the door? Mathematically, you get infinitely close, but practically, you "reach" the limit.

### Formal Definition

The limit of $f(x)$ as $x$ approaches $c$ is $L$ if for every $\\epsilon > 0$, there exists a $\\delta > 0$ such that...

**Key Concepts:**
- One-sided limits
- Infinite limits
- Continuity at a point
            `,
            youtube: "https://www.youtube.com/embed/kfF40MiS7zA", // 3Blue1Brown Limit
            textbook: "https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function"
        },
        "derivatives": {
            title: "Derivatives",
            content: "# Derivatives\n\nThe derivative measures the rate of change...",
            youtube: "https://www.youtube.com/embed/9vKqVkMQHKk",
            textbook: "https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative"
        }
        // ... add more mock data as needed
    },
    // ... linear algebra
} as const;

export default function ModulePage({ params }: { params: { courseId: string; moduleId: string } }) {
    const { courseId, moduleId } = params;

    // Quick and dirty safe access for mock data
    const course = MODULE_CONTENT[courseId as keyof typeof MODULE_CONTENT];
    const moduleData = course ? course[moduleId as keyof typeof course] : null;

    if (!moduleData) {
        return notFound();
    }

    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] overflow-hidden flex flex-col lg:flex-row">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r bg-background">
                <div className="p-4 border-b flex items-center gap-4">
                    <Link href={`/courses/${courseId}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">{moduleData.title}</h1>
                        <p className="text-sm text-muted-foreground capitalize">{courseId.replace('-', ' ')}</p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-8">
                    <div className="prose prose-blue dark:prose-invert max-w-none">
                        <ReactMarkdown>
                            {moduleData.content}
                        </ReactMarkdown>
                    </div>
                </ScrollArea>
            </div>

            {/* Sidebar / Resources */}
            <div className="w-full lg:w-80 bg-muted/30 p-4 border-l overflow-y-auto">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Recommended Resources
                </h3>

                <div className="space-y-6">
                    {/* Video Embed */}
                    {moduleData.youtube && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Video Lecture
                            </label>
                            <div className="aspect-video rounded-lg overflow-hidden border shadow-sm bg-black">
                                <iframe
                                    src={moduleData.youtube}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Visual explanation by 3Blue1Brown.
                            </p>
                        </div>
                    )}

                    <Separator />

                    {/* Textbook Link */}
                    {moduleData.textbook && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Reading Material
                            </label>
                            <Link href={moduleData.textbook} target="_blank" rel="noopener noreferrer">
                                <Card className="hover:bg-accent transition-colors">
                                    <CardContent className="p-3 flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 rounded-md">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">OpenStax Calculus</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                External Link <ExternalLink className="w-3 h-3" />
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
