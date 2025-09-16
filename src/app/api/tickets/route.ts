import { db } from "@/app/db";
import { NextResponse } from "next/server";
import { helpRequests } from "@/app/db/drizzle/schema"; // Make sure this path is correct and help_requests is exported
import { eq } from "drizzle-orm"; // Import eq from drizzle-orm or your ORM package

export async function POST(req: Request) {
    const body = await req.json();
    await db.insert(helpRequests).values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        course: body.course,
        description: body.description,
        status: 'open',
    }).returning();
    return NextResponse.json({ message: 'Ticket created successfully' }, { status: 201 });
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const allowedStatuses = ['open', 'closed', 'in_progress', 'resolved'] as const;
    type Status = typeof allowedStatuses[number];

    try {
        const results = status && status !== 'all' && allowedStatuses.includes(status as Status)
            ? await db.select().from(helpRequests).where(eq(helpRequests.status, status as Status))
            : await db.select().from(helpRequests);

        return NextResponse.json({ helpRequests: results }, { status: 200 });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}

export async function PUT() {


};

export async function DELETE() {

};