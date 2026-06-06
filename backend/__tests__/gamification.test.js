const { calculateRank, computeStreak } = require('../src/services/gamificationService');

describe('calculateRank', () => {
  test('XP = 0 → ранг TRAINEE', () => {
    expect(calculateRank(0)).toBe('TRAINEE');
  });

  test('XP = 499 (один до порогу JUNIOR) → ранг TRAINEE', () => {
    expect(calculateRank(499)).toBe('TRAINEE');
  });

  test('XP = 500 (точно поріг JUNIOR) → ранг JUNIOR', () => {
    expect(calculateRank(500)).toBe('JUNIOR');
  });

  test('XP = 1999 (один до порогу MIDDLE) → ранг JUNIOR', () => {
    expect(calculateRank(1999)).toBe('JUNIOR');
  });

  test('XP = 2000 (точно поріг MIDDLE) → ранг MIDDLE', () => {
    expect(calculateRank(2000)).toBe('MIDDLE');
  });

  test('XP = 4999 (один до порогу SENIOR) → ранг MIDDLE', () => {
    expect(calculateRank(4999)).toBe('MIDDLE');
  });

  test('XP = 5000 (точно поріг SENIOR) → ранг SENIOR', () => {
    expect(calculateRank(5000)).toBe('SENIOR');
  });

  test('XP = 11999 (один до порогу LEAD) → ранг SENIOR', () => {
    expect(calculateRank(11999)).toBe('SENIOR');
  });

  test('XP = 12000 (точно поріг LEAD) → ранг LEAD', () => {
    expect(calculateRank(12000)).toBe('LEAD');
  });

  test('XP = 50000 (значно вище порогу LEAD) → ранг LEAD', () => {
    expect(calculateRank(50000)).toBe('LEAD');
  });
});

describe('computeStreak', () => {
  test('відсутність попередньої активності → серія дорівнює 1', () => {
    const user = { lastActiveAt: null, streakDays: 0 };
    expect(computeStreak(user)).toBe(1);
  });

  test('відсутність попередньої активності при будь-якому streakDays → 1', () => {
    const user = { lastActiveAt: undefined, streakDays: 10 };
    expect(computeStreak(user)).toBe(1);
  });

  test('активність у ту саму добу → серія не змінюється', () => {
    const now = new Date(2026, 4, 29, 18, 0);
    const user = {
      lastActiveAt: new Date(2026, 4, 29, 8, 0),
      streakDays: 5,
    };
    expect(computeStreak(user, now)).toBe(5);
  });

  test('активність наступної доби → серія збільшується на 1', () => {
    const now = new Date(2026, 4, 30, 10, 0);
    const user = {
      lastActiveAt: new Date(2026, 4, 29, 20, 0),
      streakDays: 5,
    };
    expect(computeStreak(user, now)).toBe(6);
  });

  test('активність наступної доби з streakDays = 0 → серія стає 1', () => {
    const now = new Date(2026, 4, 30, 10, 0);
    const user = {
      lastActiveAt: new Date(2026, 4, 29, 20, 0),
      streakDays: 0,
    };
    expect(computeStreak(user, now)).toBe(1);
  });

  test('пропуск двох діб → серія обнуляється до 1', () => {
    const now = new Date(2026, 4, 31, 10, 0);
    const user = {
      lastActiveAt: new Date(2026, 4, 29, 10, 0),
      streakDays: 5,
    };
    expect(computeStreak(user, now)).toBe(1);
  });

  test('пропуск тижня → серія обнуляється до 1', () => {
    const now = new Date(2026, 5, 5, 10, 0);
    const user = {
      lastActiveAt: new Date(2026, 4, 29, 10, 0),
      streakDays: 20,
    };
    expect(computeStreak(user, now)).toBe(1);
  });
});
