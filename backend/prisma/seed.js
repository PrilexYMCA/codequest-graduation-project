const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@codequest.local';
const ADMIN_PASSWORD = 'admin12345';

const achievements = [
  { code: 'FIRST_TASK', title: 'Перший крок', description: 'Розвʼязано першу задачу', condition: 'tasks_completed >= 1', xpReward: 10 },
  { code: 'TASKS_10', title: 'Десятка позаду', description: 'Розвʼязано 10 задач', condition: 'tasks_completed >= 10', xpReward: 30 },
  { code: 'TASKS_50', title: 'Половина сотні', description: 'Розвʼязано 50 задач', condition: 'tasks_completed >= 50', xpReward: 100 },
  { code: 'TASKS_100', title: 'Сотня позаду', description: 'Розвʼязано 100 задач', condition: 'tasks_completed >= 100', xpReward: 250 },
  { code: 'STREAK_7', title: 'Тиждень в темпі', description: 'Серія активності 7 днів', condition: 'streak_days >= 7', xpReward: 50 },
  { code: 'STREAK_30', title: 'Місяць дисципліни', description: 'Серія активності 30 днів', condition: 'streak_days >= 30', xpReward: 200 },
  { code: 'RANK_JUNIOR', title: 'Перший ранг', description: 'Досягнуто рангу Junior', condition: 'rank == JUNIOR', xpReward: 20 },
  { code: 'RANK_MIDDLE', title: 'На середині шляху', description: 'Досягнуто рангу Middle', condition: 'rank == MIDDLE', xpReward: 50 },
  { code: 'RANK_SENIOR', title: 'Старший розробник', description: 'Досягнуто рангу Senior', condition: 'rank == SENIOR', xpReward: 100 },
  { code: 'RANK_LEAD', title: 'Командний лідер', description: 'Досягнуто рангу Lead', condition: 'rank == LEAD', xpReward: 300 },
];

async function seedAchievements() {
  console.log('Seeding achievements...');
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { code: a.code },
      update: a,
      create: a,
    });
  }
  console.log(`  ${achievements.length} achievements ready.`);
}

async function seedAdmin() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log(`Admin user already exists (${ADMIN_EMAIL}).`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: 'Administrator',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin user created:');
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}`);
  console.log('  (change the password through the personal cabinet after first login)');
}

async function seedCourses() {
  const existing = await prisma.course.count();
  if (existing > 0) {
    console.log(`Skipping courses (${existing} already exist). Delete them in Prisma Studio to re-seed.`);
    return;
  }

  console.log('Seeding course content...');

  const course = await prisma.course.create({
    data: {
      title: 'Основи JavaScript',
      description: 'Базовий курс програмування на JavaScript для початківців',
      level: 'BEGINNER',
      isPublished: true,
      modules: {
        create: [
          {
            title: 'Введення в JavaScript',
            position: 1,
            lessons: {
              create: [
                {
                  title: 'Перша функція',
                  content: 'У цьому уроці розглядається базовий синтаксис функцій у JavaScript. Функція оголошується ключовим словом function, приймає параметри у круглих дужках і повертає значення через ключове слово return.',
                  position: 1,
                  tasks: {
                    create: [
                      {
                        title: 'Привітання',
                        description: 'Напишіть функцію solution(name), яка приймає імʼя та повертає рядок "Привіт, [name]!" (де [name] замінюється на передане імʼя).',
                        starterCode: 'function solution(name) {\n  // ваш код тут\n}',
                        xpReward: 10,
                        testCases: {
                          create: [
                            { input: '["Анна"]', expectedOutput: '"Привіт, Анна!"' },
                            { input: '["Іван"]', expectedOutput: '"Привіт, Іван!"' },
                            { input: '["World"]', expectedOutput: '"Привіт, World!"' },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  title: 'Арифметичні операції',
                  content: 'JavaScript підтримує всі базові арифметичні операції: додавання (+), віднімання (-), множення (*), ділення (/), залишок від ділення (%).',
                  position: 2,
                  tasks: {
                    create: [
                      {
                        title: 'Сума двох чисел',
                        description: 'Напишіть функцію solution(a, b), яка повертає суму двох чисел.',
                        starterCode: 'function solution(a, b) {\n  // ваш код тут\n}',
                        xpReward: 15,
                        testCases: {
                          create: [
                            { input: '[2, 3]', expectedOutput: '5' },
                            { input: '[10, -3]', expectedOutput: '7' },
                            { input: '[0, 0]', expectedOutput: '0' },
                            { input: '[100, 250]', expectedOutput: '350' },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Умови та цикли',
            position: 2,
            lessons: {
              create: [
                {
                  title: 'Умовні оператори',
                  content: 'Умовний оператор if дозволяє виконувати різні дії залежно від результату перевірки умови. Для перевірки парності використовується оператор залишку від ділення %.',
                  position: 1,
                  tasks: {
                    create: [
                      {
                        title: 'Парне число',
                        description: 'Напишіть функцію solution(n), яка приймає ціле число та повертає true, якщо воно парне, або false, якщо непарне.',
                        starterCode: 'function solution(n) {\n  // ваш код тут\n}',
                        xpReward: 20,
                        testCases: {
                          create: [
                            { input: '[2]', expectedOutput: 'true' },
                            { input: '[3]', expectedOutput: 'false' },
                            { input: '[0]', expectedOutput: 'true' },
                            { input: '[-4]', expectedOutput: 'true' },
                            { input: '[15]', expectedOutput: 'false' },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`  Course created: ${course.title} (id=${course.id})`);
}

async function main() {
  await seedAchievements();
  await seedAdmin();
  await seedCourses();
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
