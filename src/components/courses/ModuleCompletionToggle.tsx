'use client'

import { toggleModuleCompletion } from '@/app/actions/progress'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export function ModuleCompletionToggle({
    moduleId,
    courseId,
    initialCompleted
}: {
    moduleId: string
    courseId: string
    initialCompleted: boolean
}) {
    const [completed, setCompleted] = useState(initialCompleted)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        const previousState = completed
        setCompleted(!completed)

        try {
            await toggleModuleCompletion(moduleId, courseId)
        } catch (error) {
            // Revert on error
            setCompleted(previousState)
            console.error('Failed to toggle completion:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`
                flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 border
                ${completed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-white border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }
                ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <CheckCircle
                className={`w-5 h-5 transition-colors ${completed ? 'text-emerald-500' : 'text-gray-300'}`}
            />
            <span>{completed ? 'Completed' : 'Mark as complete'}</span>
        </button>
    )
}
