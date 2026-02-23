import { prisma } from "./prisma";

/**
 * KimyaLAB Core Game Logic
 * Centralized server-side logic for progression and leveling.
 */

export const LEVEL_EXP_BASE = 1000;

export function calculateLevel(points: number): number {
    return Math.floor(points / LEVEL_EXP_BASE) + 1;
}

export function getProgressToNextLevel(points: number): number {
    return (points % LEVEL_EXP_BASE) / LEVEL_EXP_BASE;
}

/**
 * Logs a user activity in the database for analytics and security.
 */
export async function logActivity(userId: string, action: string, metadata?: any) {
    try {
        await prisma.activityLog.create({
            data: {
                userId,
                action,
                metadata: metadata ? JSON.stringify(metadata) : null,
            }
        });
    } catch (error) {
        console.error("Activity logging failed:", error);
    }
}

/**
 * Achievement Engine: Processes database events to unlock achievements.
 * This runs on the server after submissions.
 */
export async function processAchievements(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { attempts: true, achievements: true }
    });

    if (!user) return;

    const existingTypes = new Set(user.achievements.map(a => a.type));
    const newAchievements = [];

    // 1. "Mole Master" - Finish 5 quizzes
    if (!existingTypes.has("MOLE_MASTER") && user.attempts.length >= 5) {
        newAchievements.push({
            type: "MOLE_MASTER",
            name: "Moleküler Üstat",
            description: "5 simülasyonu başarıyla tamamladın."
        });
    }

    // 2. "Atomic Fast" - Average score over 90%
    const avgScore = user.attempts.reduce((acc, curr) => acc + curr.score, 0) / user.attempts.length;
    if (!existingTypes.has("ATOMIC_PRO") && user.attempts.length >= 3 && avgScore >= 90) {
        newAchievements.push({
            type: "ATOMIC_PRO",
            name: "Atomik Profesyonel",
            description: "Ortalama başarın %90'ın üzerine çıktı!"
        });
    }

    // 3. "Streak Starter" - 3 day streak
    if (!existingTypes.has("STREAK_3") && user.streak >= 3) {
        newAchievements.push({
            type: "STREAK_3",
            name: "Bağ Kurucu",
            description: "3 günlük kesintisiz kimya bağı kurdun."
        });
    }

    if (newAchievements.length > 0) {
        await prisma.achievement.createMany({
            data: newAchievements.map(a => ({
                ...a,
                userId
            }))
        });
    }

    return newAchievements;
}
