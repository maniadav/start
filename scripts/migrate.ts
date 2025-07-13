#!/usr/bin/env node

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { migrationManager } from "../src/lib/migrations";

async function runMigrationCommand() {
  const command = process.argv[2];
  const version = process.argv[3];

  try {
    switch (command) {
      case "up":
        console.log("🚀 Starting database migrations...");
        await migrationManager.runMigrations();
        console.log("✅ All migrations completed successfully");
        break;

      case "down":
        if (!version) {
          console.error("❌ Please specify a version to rollback");
          process.exit(1);
        }
        console.log(`🔄 Rolling back migration ${version}...`);
        await migrationManager.rollbackMigration(version);
        console.log("✅ Rollback completed successfully");
        break;

      case "status":
        console.log("📊 Migration Status:");
        const status = await migrationManager.getStatus();
        status.forEach((s) => {
          const icon = s.applied ? "✅" : "⏳";
          console.log(`${icon} ${s.version}: ${s.description}`);
        });
        break;

      default:
        console.log(`
🛠️  MongoDB Migration Tool

    Usage:
    npm run migrate up          - Run all pending migrations
    npm run migrate down <ver>  - Rollback specific migration
    npm run migrate status      - Show migration status

    Examples:
    npm run migrate up
    npm run migrate down 002
    npm run migrate status
        `);
        break;
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigrationCommand();
