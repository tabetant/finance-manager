'use client';
import { supabase } from '../db/client';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react'

export default function DashboardPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        const checkLoggedin = async () => {
            const { data: { session } } = await supabase().auth.getSession();
            if (!session) {
                setError('You must be logged in to access this page.');
                router.push('/login');
            } else {
                const userResponse = await supabase().auth.getUser();
                setEmail(userResponse.data.user?.email || '');
            }
        };
        checkLoggedin();
    }), [router]
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">WorldEd Dashboard</h1>

                <div className="bg-white shadow rounded-xl p-6 mb-6">
                    <p className="text-lg">Welcome, <span className="font-semibold">{email}</span></p>
                    <p className="text-gray-600 mt-2">This is your dashboard placeholder.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white shadow rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
                        <p className="text-gray-600">0/1 lessons complete</p>
                    </div>

                    <div className="bg-white shadow rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => supabase().auth.signOut()}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Sign Out
                            </button>

                            <button
                                onClick={() => router.push("/ticketsubmission")}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Ask for Help
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

