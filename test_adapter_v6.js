const { PrismaClient } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");
require("dotenv").config();

async function main() {
    const url = process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
        console.error("DATABASE_URL is not set");
        return;
    }

    console.log("Testing factory pattern...");

    try {
        // In Prisma 6, PrismaLibSQL might be useable directly if it implements the adapter interface
        // or we might need the factory.
        const factory = new PrismaLibSQL({ url, authToken });
        const adapter = await factory.connect();

        console.log("Adapter obtained from factory:", adapter.constructor.name);

        const prisma = new PrismaClient({ adapter });

        const count = await prisma.user.count();
        console.log("Count successful:", count);
        await prisma.$disconnect();
    } catch (e) {
        console.error("Factory test failed:", e);

        console.log("Trying direct client pass to PrismaLibSQL...");
        try {
            const client = createClient({ url, authToken });
            // Maybe PrismaLibSQL IS the adapter but renamed?
            const { PrismaLibSQL: PrismaLibSQLFromLib } = require("@prisma/adapter-libsql");
            const adapter = new PrismaLibSQLFromLib(client);
            const prisma = new PrismaClient({ adapter });
            const count = await prisma.user.count();
            console.log("Direct pass successful:", count);
            await prisma.$disconnect();
        } catch (e2) {
            console.error("Direct pass failed:", e2);
        }
    }
}

main();
