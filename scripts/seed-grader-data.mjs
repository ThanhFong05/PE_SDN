import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pristine grader account and 5 sample sessions...');

  // Clean up old temporary test users
  await prisma.user.deleteMany({
    where: {
      email: {
        not: 'grader.qe190030@example.com',
      },
    },
  });

  // Ensure grader user exists with Test1234!
  const graderEmail = 'grader.qe190030@example.com';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Test1234!', salt);

  let grader = await prisma.user.findUnique({
    where: { email: graderEmail },
  });

  if (!grader) {
    grader = await prisma.user.create({
      data: {
        email: graderEmail,
        passwordHash,
      },
    });
  } else {
    grader = await prisma.user.update({
      where: { email: graderEmail },
      data: { passwordHash },
    });
  }

  // Clear any existing logs for grader
  await prisma.readingLog.deleteMany({
    where: { userId: grader.id },
  });

  // Create 5 sample sessions in 3 genres
  const sampleLogs = [
    {
      userId: grader.id,
      bookTitle: 'Atomic Habits',
      minutesRead: 45,
      genre: 'Non-Fiction',
      note: 'Chapter 3 - The 4 Laws of Behavior Change',
      favorite: true,
      readOn: new Date('2026-10-25T00:00:00Z'),
    },
    {
      userId: grader.id,
      bookTitle: 'The Great Gatsby',
      minutesRead: 60,
      genre: 'Fiction',
      note: 'Chapter 1 - Introduction to Nick and Gatsby',
      favorite: false,
      readOn: new Date('2026-10-24T00:00:00Z'),
    },
    {
      userId: grader.id,
      bookTitle: 'Dune',
      minutesRead: 90,
      genre: 'Sci-Fi',
      note: 'Book One: Arrakis and Paul Atreides',
      favorite: true,
      readOn: new Date('2026-10-23T00:00:00Z'),
    },
    {
      userId: grader.id,
      bookTitle: 'Sapiens: A Brief History of Humankind',
      minutesRead: 50,
      genre: 'Non-Fiction',
      note: 'The Cognitive Revolution',
      favorite: false,
      readOn: new Date('2026-10-22T00:00:00Z'),
    },
    {
      userId: grader.id,
      bookTitle: 'To Kill a Mockingbird',
      minutesRead: 40,
      genre: 'Fiction',
      note: 'Classic courtroom trial scenes',
      favorite: false,
      readOn: new Date('2026-10-20T00:00:00Z'),
    },
  ];

  for (const log of sampleLogs) {
    await prisma.readingLog.create({ data: log });
  }

  const count = await prisma.readingLog.count({ where: { userId: grader.id } });
  console.log(`✓ Successfully seeded ${count} sessions for ${graderEmail}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
