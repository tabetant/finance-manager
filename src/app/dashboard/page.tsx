'use client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react'
import { StudentView } from '@/components/dashboard/StudentView';
import { MentorDashboard } from '@/components/dashboard/MentorDashboard';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<'student' | 'mentor'>('student'); // Default to student for now, fetch from DB later

    useEffect(() => {
        const checkLoggedin = async () => {
            const { data: { session } } = await createClient().auth.getSession();
            if (!session) {
                router.push('/auth');
            } else {
                setLoading(false);
                // TODO: Fetch user role from 'users' table
            }
        };
        checkLoggedin();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="relative">
            {/* Dev Toggle for demo purposes */}
            <div className="fixed bottom-4 left-4 z-40 opacity-50 hover:opacity-100 transition-opacity">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserRole(r => r === 'student' ? 'mentor' : 'student')}
                >
                    Switch to {userRole === 'student' ? 'Mentor' : 'Student'} View
                </Button>
            </div>

            {userRole === 'student' ? <StudentView /> : <MentorDashboard />}
        </div>
    );
}

