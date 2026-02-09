import { db } from "@/db";
import { courses } from "@/app/db/drizzle/schema";
import Link from "next/link";
import { GraduationCap, BookOpen, Clock } from "lucide-react";

export default async function CoursesPage() {
    const allCourses = await db.select().from(courses);

    return (
        <div className="min-h-screen bg-[var(--background-subtle)]">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">All Courses</h1>
                    <p className="text-muted-foreground">Explore our complete catalog of courses</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCourses.map(course => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="text-4xl mb-4">{course.iconName || '📚'}</div>
                                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                    {course.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <BookOpen size={14} />
                                        <span>Modules</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>~2 hours</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {allCourses.length === 0 && (
                    <div className="text-center py-16">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <p className="text-xl text-muted-foreground">No courses available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
