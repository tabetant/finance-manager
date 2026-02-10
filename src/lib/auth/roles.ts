/**
 * Role-Based Access Control (RBAC) utilities
 * Uses the `users` table `role` column (enum: student | mentor | admin)
 * backed by Supabase Auth.
 */

import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { users } from '@/app/db/drizzle/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export type UserRole = 'student' | 'mentor' | 'admin'

/**
 * Get the current user's role from the database.
 */
export async function getUserRole(): Promise<UserRole> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 'student'

    const dbUser = await db.select({ role: users.role })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1)

    return (dbUser[0]?.role as UserRole) || 'student'
}

/**
 * Check if current user has one of the required roles.
 */
export async function hasRole(requiredRole: UserRole | UserRole[]): Promise<boolean> {
    const userRole = await getUserRole()
    return Array.isArray(requiredRole)
        ? requiredRole.includes(userRole)
        : userRole === requiredRole
}

/**
 * Require a specific role or redirect. Use in server components / actions.
 */
export async function requireRole(
    requiredRole: UserRole | UserRole[],
    redirectTo: string = '/'
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth')

    const allowed = await hasRole(requiredRole)
    if (!allowed) redirect(redirectTo)
}

/**
 * Shorthand: require admin role or redirect.
 */
export async function requireAdmin(redirectTo: string = '/') {
    await requireRole('admin', redirectTo)
}

/**
 * Shorthand: check if current user is admin.
 */
export async function isAdmin(): Promise<boolean> {
    return hasRole('admin')
}
