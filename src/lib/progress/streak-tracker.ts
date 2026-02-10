import { db } from '@/db'
import { userStreaks } from '@/app/db/drizzle/schema'
import { eq } from 'drizzle-orm'

/**
 * Get start of day (midnight) for a date
 */
function getStartOfDay(date: Date): Date {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

/**
 * Update streak when user completes a quiz.
 * Increments if consecutive day, resets to 1 if day was skipped.
 */
export async function updateStreakOnQuizCompletion(userId: string) {
    const today = getStartOfDay(new Date())

    const streakRecord = await db.select()
        .from(userStreaks)
        .where(eq(userStreaks.userId, userId))
        .limit(1)

    if (!streakRecord[0]) {
        // First quiz ever — start streak at 1
        await db.insert(userStreaks).values({
            userId,
            currentStreak: 1,
            longestStreak: 1,
            lastQuizDate: today,
        })
        return { currentStreak: 1, longestStreak: 1 }
    }

    const { currentStreak, longestStreak, lastQuizDate } = streakRecord[0]

    // Already completed a quiz today — no change
    if (lastQuizDate && getStartOfDay(lastQuizDate).getTime() === today.getTime()) {
        return { currentStreak: currentStreak ?? 0, longestStreak: longestStreak ?? 0 }
    }

    let newStreak: number

    if (lastQuizDate) {
        const lastQuizDay = getStartOfDay(lastQuizDate)
        const diffDays = Math.floor(
            (today.getTime() - lastQuizDay.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diffDays === 1) {
            // Consecutive day — increment
            newStreak = (currentStreak ?? 0) + 1
        } else {
            // Skipped day(s) — reset to 1
            newStreak = 1
        }
    } else {
        newStreak = 1
    }

    const newLongestStreak = Math.max(newStreak, longestStreak ?? 0)

    await db.update(userStreaks)
        .set({
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastQuizDate: today,
            updatedAt: new Date(),
        })
        .where(eq(userStreaks.userId, userId))

    return { currentStreak: newStreak, longestStreak: newLongestStreak }
}

/**
 * Get current streak for display on dashboard.
 * Auto-resets if user has missed a day.
 */
export async function getCurrentStreak(userId: string) {
    const today = getStartOfDay(new Date())

    const streakRecord = await db.select()
        .from(userStreaks)
        .where(eq(userStreaks.userId, userId))
        .limit(1)

    if (!streakRecord[0]) {
        return { currentStreak: 0, longestStreak: 0 }
    }

    const { currentStreak, longestStreak, lastQuizDate } = streakRecord[0]

    // Check if streak should be reset (missed more than 1 day)
    if (lastQuizDate) {
        const lastQuizDay = getStartOfDay(lastQuizDate)
        const daysSinceLastQuiz = Math.floor(
            (today.getTime() - lastQuizDay.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysSinceLastQuiz > 1) {
            await db.update(userStreaks)
                .set({ currentStreak: 0, updatedAt: new Date() })
                .where(eq(userStreaks.userId, userId))

            return { currentStreak: 0, longestStreak: longestStreak ?? 0 }
        }
    }

    return { currentStreak: currentStreak ?? 0, longestStreak: longestStreak ?? 0 }
}
