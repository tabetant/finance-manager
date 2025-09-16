import db from "@/app/db/drizzle/client";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    const body = await req.json();
    await db.insert("help_requests").values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        course: body.course,
        description: body.description,
        status: 'open',
    }).returning();
    return NextResponse(JSON.stringify({ message: 'Ticket created successfully' }), { status: 201 });
};

export async function GET() {
    const tickets = await db.select().from('help_requests');
    return NextResponse.json(tickets);
};

export async function PUT() {


};

export async function DELETE() {

};