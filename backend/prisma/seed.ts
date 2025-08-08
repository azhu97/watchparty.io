import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      username: 'john_doe',
      password: 'password123', // In real app, this would be hashed
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      username: 'jane_smith',
      password: 'password123',
    },
  });

  // Create sample games
  const game1 = await prisma.game.create({
    data: {
      homeTeam: 'Lakers',
      awayTeam: 'Warriors',
      homeScore: 95,
      awayScore: 88,
      quarter: 3,
      timeLeft: '7:23',
      status: 'LIVE',
      gameDate: new Date('2025-08-07T20:00:00Z'),
    },
  });

  const game2 = await prisma.game.create({
    data: {
      homeTeam: 'Celtics',
      awayTeam: 'Heat',
      homeScore: 102,
      awayScore: 97,
      quarter: 4,
      timeLeft: 'Final',
      status: 'FINISHED',
      gameDate: new Date('2025-08-06T19:30:00Z'),
    },
  });

  const game3 = await prisma.game.create({
    data: {
      homeTeam: 'Bulls',
      awayTeam: 'Knicks',
      homeScore: 0,
      awayScore: 0,
      quarter: 1,
      timeLeft: '12:00',
      status: 'SCHEDULED',
      gameDate: new Date('2025-08-08T21:00:00Z'),
    },
  });

  // Create sample chat messages
  await prisma.chatMessage.create({
    data: {
      message: 'This is going to be an amazing game!',
      userId: user1.id,
      gameId: game1.id,
    },
  });

  await prisma.chatMessage.create({
    data: {
      message: 'Lakers looking strong tonight 💪',
      userId: user2.id,
      gameId: game1.id,
    },
  });

  // Create sample favorite games
  await prisma.favoriteGame.create({
    data: {
      userId: user1.id,
      gameId: game1.id,
    },
  });

  await prisma.favoriteGame.create({
    data: {
      userId: user2.id,
      gameId: game2.id,
    },
  });

  // Create sample watch party
  const watchParty = await prisma.watchParty.create({
    data: {
      name: 'Lakers vs Warriors Watch Party',
      description: 'Come watch the game with us!',
      isPrivate: false,
      maxUsers: 25,
      hostId: user1.id,
      gameId: game1.id,
    },
  });

  // Add participant to watch party
  await prisma.watchPartyParticipant.create({
    data: {
      userId: user2.id,
      watchPartyId: watchParty.id,
    },
  });

  console.log('Database seeded successfully! 🌱');
  console.log({
    users: 2,
    games: 3,
    chatMessages: 2,
    favorites: 2,
    watchParties: 1,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });