#!/usr/bin/env node

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { migrationManager } from "../src/lib/migrations";
import AppConfig from "../src/config/app.config";

async function runMigrationCommand() {
  const command = process.argv[2];
  const version = process.argv[3];

  // Validate configuration before running migrations
  try {
    AppConfig.validate();
    console.log(
      `Target Database: ${migrationManager.getTargetDatabaseName()}`
    );
  } catch (error) {
    console.error("ERROR: Configuration validation failed:", error);
    process.exit(1);
  }

  try {
    switch (command) {
      case "up":
        console.log("Starting database migrations...");
        console.log(
          `Migrating to database: ${migrationManager.getTargetDatabaseName()}`
        );
        console.log(
          "INFO: Migration 'up' will only CREATE and ADD data - no existing data will be removed"
        );
        await migrationManager.runMigrations();
        console.log("All migrations completed successfully");
        console.log("INFO: No existing data was removed during migration");
        break;

      case "status":
        console.log("Migration Status:");
        console.log(`Database: ${migrationManager.getTargetDatabaseName()}`);
        const status = await migrationManager.getStatus();
        status.forEach((s) => {
          const statusText = s.applied ? "[APPLIED]" : "[PENDING]";
          console.log(`${statusText} ${s.version}: ${s.description}`);
        });
        break;

      default:
        console.log(`
MongoDB Migration Tool

    Usage:
    yarn migrate up          - Run all pending migrations (CREATE/ADD data only)
    yarn migrate status      - Show migration status
        `);
        break;
    }
  } catch (error) {
    console.error("ERROR: Migration failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigrationCommand();
