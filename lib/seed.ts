import { sql } from "./db";
import { logger } from "./logger";
import { RSS_SOURCES } from "@/config/rss-sources";

export async function seedDatabase(): Promise<void> {
  try {
    logger.info("Starting database seeding");

    // Check if admin user exists
    const userResult = await sql`SELECT COUNT(*) as count FROM users`;
    const userCount = parseInt(userResult.rows[0]?.count || "0");

    if (userCount === 0) {
      const username = process.env.ADMIN_USERNAME || "admin";
      const passwordHash = process.env.ADMIN_PASSWORD_HASH;

      if (!passwordHash) {
        logger.warn("ADMIN_PASSWORD_HASH not set, skipping admin user creation");
      } else {
        await sql`
          INSERT INTO users (username, password_hash)
          VALUES (${username}, ${passwordHash})
        `;
        logger.info("Admin user created", { username });
      }
    } else {
      logger.info("Users already exist, skipping user seeding");
    }

    // Check if sources exist
    const sourceResult = await sql`SELECT COUNT(*) as count FROM sources`;
    const sourceCount = parseInt(sourceResult.rows[0]?.count || "0");

    if (sourceCount === 0) {
      for (const source of RSS_SOURCES) {
        await sql`
          INSERT INTO sources (name, url, category, active)
          VALUES (${source.name}, ${source.url}, ${source.category}, true)
          ON CONFLICT (url) DO NOTHING
        `;
      }
      logger.info("RSS sources seeded", { count: RSS_SOURCES.length });
    } else {
      logger.info("Sources already exist, skipping source seeding");
    }

    logger.info("Database seeding completed");
  } catch (error) {
    logger.error("Database seeding failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
