'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

import {
    Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger
} from '../ui/Popover';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/Dropdown';

export type Ticket = {
    id: number;
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') ?? 'all';
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');

    const fetchTickets = async () => {
        try {
            const response = await fetch(`api/tickets?status=${status}`);
            if (!response.ok) {
                console.error(`Error fetching tickets: ${response.statusText}`);
                return;
            }
            const ticketsData = await response.json();

            setTickets(ticketsData.tickets);
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkLoggedIn = async () => {
            const { data: { session } } = await supabase().auth.getSession();
            if (!session) {
                setError('You must be logged in to access this page.');
                router.push('/login');
            } else {
                const userResponse = await supabase.auth.getUser();
                setEmail(userResponse.data.user?.email || '');
            }
        }
        checkLoggedIn();
        fetchTickets();
    }, [status, router]);

    return (
        <div className="flex-1 bg-gray-100 p-6 min-h-screen overflow-auto">
            {status === "all" ? (
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[calc(100vh-5rem)]">
                    {statuses.map((statusItem) => (
                        <div
                            key={statusItem}
                            onDrop={(e) => handleDrop(e, statusItem as Ticket['status'])}
                            onDragOver={(e) => e.preventDefault()}
                            className="bg-white rounded-lg shadow p-4 flex flex-col gap-4 overflow-auto"
                        >
                            <h2 className="text-lg font-bold capitalize border-b pb-2 mb-2 text-blue-800">{statusItem.replace("_", " ")}</h2>
                            {tickets.filter(ticket => ticket.status === statusItem).map((ticket) => {
                                let logEntries: any[] = [];
                                try {
                                    logEntries = typeof ticket.logs === 'string'
                                        ? JSON.parse(ticket.logs || '[]')
                                        : ticket.logs || [];
                                } catch (e) {
                                    console.error("Failed to parse logs:", ticket.logs, e);
                                    logEntries = [];
                                }
                                return (
                                    <div
                                        key={ticket.id}
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData("ticketId", String(ticket.id))}
                                    >
                                        <Card className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                                            <div className="cursor-move mb-4">
                                                <h2 className="text-xl font-bold text-blue-700">{ticket.title}</h2>
                                            </div>
                                            <p className="text-gray-600 mb-4 italic">{ticket.description}</p>
                                            <div className="space-y-2 text-sm text-gray-700">
                                                <p>
                                                    <span className="font-semibold text-gray-800">Status:</span>
                                                    <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                                                </p>
                                                <p>
                                                    <span className="font-semibold text-gray-800">Submitted:</span>
                                                    <span className="ml-1">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                </p>
                                                <p>
                                                    <span className="font-semibold text-gray-800">Tenant:</span>
                                                    <span className="ml-1">{ticket.tenant}</span>
                                                </p>
                                                <p>
                                                    <span className="font-semibold text-gray-800">Customer:</span>
                                                    <span className="ml-1">{ticket.firstName} {ticket.lastName}</span><br />
                                                    <span className="ml-6 text-gray-500">{ticket.email} — {ticket.phone}</span>
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex flex-col gap-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md hover:bg-gray-300 transition">
                                                                View Logs
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80 p-4">
                                                            {logEntries.length > 0 ? (
                                                                <ul className="space-y-3">
                                                                    {logEntries.map((entry: any, index: number) => (
                                                                        <li key={index} className="border-b last:border-none pb-2">
                                                                            <p className="text-gray-800">
                                                                                <span className="font-medium text-blue-700">{entry.user}</span>{" "}
                                                                                <span>changed status to</span>{" "}
                                                                                <span className="font-semibold text-green-600">{entry.message.split("to")[1]?.trim()}</span>
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p className="italic text-gray-500">No history yet.</p>
                                                            )}
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <button
                                                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                                                    onClick={() => handleDelete(ticket.id)}
                                                >
                                                    <span>🗑️</span>
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 grid-rows-2 gap-6 h-[calc(100vh-5rem)]">

                    {tickets.map((ticket) => {
                        let logEntries: any[] = [];
                        try {
                            logEntries = typeof ticket.logs === 'string'
                                ? JSON.parse(ticket.logs || '[]')
                                : ticket.logs || [];
                        } catch (e) {
                            console.error("Failed to parse logs:", ticket.logs, e);
                            logEntries = [];
                        }
                        return (
                            <Card key={ticket.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-blue-700">{ticket.title}</h2>
                                </div>
                                <p className="text-gray-600 mb-4 italic">{ticket.description}</p>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p>
                                        <span className="font-semibold text-gray-800">Status:</span>
                                        <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-800">Submitted:</span>
                                        <span className="ml-1">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-800">Tenant:</span>
                                        <span className="ml-1">{ticket.tenant}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-800">Customer:</span>
                                        <span className="ml-1">{ticket.firstName} {ticket.lastName}</span><br />
                                        <span className="ml-6 text-gray-500">{ticket.email} — {ticket.phone}</span>
                                    </p>
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex flex-col gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition">Edit Status</button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-48">
                                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 cursor-pointer transition-colors"
                                                        onSelect={() => { updateStatus(ticket.id, 'open') }} shortcut="⌘o">Open</DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 cursor-pointer transition-colors"
                                                        onSelect={() => { updateStatus(ticket.id, 'in_progress') }} shortcut="⌘p">In Progress</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 cursor-pointer transition-colors"
                                                        onSelect={() => { updateStatus(ticket.id, 'resolved') }} shortcut="⌘r">Resolved</DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 cursor-pointer transition-colors"
                                                    onSelect={() => { updateStatus(ticket.id, 'closed') }} shortcut="⇧⌘c">Closed</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md hover:bg-gray-300 transition">
                                                    View Logs
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-4">
                                                {logEntries.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {logEntries.map((entry: any, index: number) => (
                                                            <li key={index} className="border-b last:border-none pb-2">
                                                                <p className="text-gray-800">
                                                                    <span className="font-medium text-blue-700">{entry.user}</span>{" "}
                                                                    <span>changed status to</span>{" "}
                                                                    <span className="font-semibold text-green-600">{entry.message.split("to")[1]?.trim()}</span>
                                                                </p>
                                                                <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="italic text-gray-500">No history yet.</p>
                                                )}
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <button
                                        className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                                        onClick={() => handleDelete(ticket.id)}
                                    >
                                        <span>🗑️</span>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={async () => await supabase.auth.signOut()}
                    className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}