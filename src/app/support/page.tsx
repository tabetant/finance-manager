import { LargeNumberLike } from "crypto";
export type Ticket = {
    id: LargeNumberLike;
    title: string;
    description: string;
    firstName: string;
    lastName: string;
    course: string;
    email: string;
    phone: string;
    status: 'open' | 'in_progress' | 'closed' | 'resolved';
    createdAt: Date;
    updatedAt: Date;
    logs: string;
};

export default function SupportPage() {

    return <div>Support Page Placeholder</div>;
}