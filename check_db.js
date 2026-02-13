
const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();

async function check() {
    const users = await client.user.findMany({
        select: { id: true, name: true, email: true, points: true, level: true, streak: true }
    });
    console.log("Users in DB:", JSON.stringify(users, null, 2));
    process.exit(0);
}

check();
