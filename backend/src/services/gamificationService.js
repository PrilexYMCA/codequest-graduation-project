const prisma = require('../config/prisma');

const RANK_THRESHOLDS = [
  { rank: 'TRAINEE', minXp: 0 },
  { rank: 'JUNIOR', minXp: 500 },
  { rank: 'MIDDLE', minXp: 2000 },
  { rank: 'SENIOR', minXp: 5000 },
  { rank: 'LEAD', minXp: 12000 },
];

function calculateRank(xp) {
  let current = 'TRAINEE';
  for (const t of RANK_THRESHOLDS) {
    if (xp >= t.minXp) current = t.rank;
  }
  return current;
}

function computeStreak(user, now = new Date()) {
  if (!user.lastActiveAt) return 1;

  const last = new Date(user.lastActiveAt);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const diffDays = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return user.streakDays || 1;
  if (diffDays === 1) return (user.streakDays || 0) + 1;
  return 1;
}

async function countUniqueCompletedTasks(userId) {
  const completed = await prisma.submission.findMany({
    where: { userId, status: 'PASSED' },
    distinct: ['taskId'],
    select: { taskId: true },
  });
  return completed.length;
}

async function checkAchievements(userId, user) {
  const achievements = await prisma.achievement.findMany();
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  const tasksCompleted = await countUniqueCompletedTasks(userId);
  const newAchievements = [];

  for (const a of achievements) {
    if (unlockedIds.has(a.id)) continue;

    let conditionMet = false;
    if (a.condition.startsWith('tasks_completed >=')) {
      const required = parseInt(a.condition.split('>=')[1].trim());
      conditionMet = tasksCompleted >= required;
    } else if (a.condition.startsWith('streak_days >=')) {
      const required = parseInt(a.condition.split('>=')[1].trim());
      conditionMet = user.streakDays >= required;
    } else if (a.condition.startsWith('rank ==')) {
      const required = a.condition.split('==')[1].trim();
      conditionMet = user.rank === required;
    }

    if (conditionMet) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: a.id },
      });
      newAchievements.push(a);
    }
  }

  return newAchievements;
}

async function awardXp(userId, xpAmount) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Користувача не знайдено');

  const newXp = user.xp + xpAmount;
  const newRank = calculateRank(newXp);
  const newStreak = computeStreak(user);
  const now = new Date();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      rank: newRank,
      streakDays: newStreak,
      lastActiveAt: now,
    },
  });

  const newAchievements = await checkAchievements(userId, updated);

  let totalXpAwarded = xpAmount;
  for (const a of newAchievements) {
    if (a.xpReward > 0) {
      totalXpAwarded += a.xpReward;
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: a.xpReward } },
      });
    }
  }

  const final = await prisma.user.findUnique({ where: { id: userId } });
  const finalRank = calculateRank(final.xp);
  if (finalRank !== updated.rank) {
    await prisma.user.update({
      where: { id: userId },
      data: { rank: finalRank },
    });
  }

  return {
    xpAwarded: totalXpAwarded,
    newXp: final.xp,
    newRank: finalRank,
    rankChanged: finalRank !== user.rank,
    streakDays: newStreak,
    newAchievements,
  };
}

async function getLeaderboard(limit = 50) {
  return await prisma.user.findMany({
    where: { role: 'STUDENT', isActive: true },
    orderBy: [{ xp: 'desc' }, { id: 'asc' }],
    take: limit,
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      xp: true,
      rank: true,
      streakDays: true,
    },
  });
}

async function getAchievementsForUser(userId) {
  const achievements = await prisma.achievement.findMany({ orderBy: { id: 'asc' } });
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true, unlockedAt: true },
  });
  const unlockedMap = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]));

  return achievements.map((a) => ({
    ...a,
    isUnlocked: unlockedMap.has(a.id),
    unlockedAt: unlockedMap.get(a.id) || null,
  }));
}

module.exports = {
  awardXp,
  calculateRank,
  computeStreak,
  getLeaderboard,
  getAchievementsForUser,
  countUniqueCompletedTasks,
};
