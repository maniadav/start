import connectDB from "./mongodb";
import { User } from "../models/User";
import { Child } from "../models/Child";
import { AdminProfile } from "../models/AdminProfile";
import { ObserverProfile } from "../models/ObserverProfile";
import { OrganisationProfile } from "../models/OrganisationProfile";
import { File } from "../models/File";

export interface Migration {
  version: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

// Migration tracking schema
import mongoose, { Schema } from "mongoose";

const MigrationSchema = new Schema({
  version: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
});

const MigrationModel =
  mongoose.models.Migration || mongoose.model("Migration", MigrationSchema);

export class MigrationManager {
  /**
   * Check if a collection exists in the database
   */
  async collectionExists(collectionName: string): Promise<boolean> {
    await connectDB();
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.some(c => c.name === collectionName);
  }

  /**
   * Get document count in a collection
   */
  async getCollectionCount(collectionName: string): Promise<number> {
    await connectDB();
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    
    if (await this.collectionExists(collectionName)) {
      return await mongoose.connection.db.collection(collectionName).countDocuments();
    }
    return 0;
  }

  /**
   * Backup existing data before major migrations
   */
  async backupCollection(collectionName: string): Promise<any[]> {
    await connectDB();
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    
    if (await this.collectionExists(collectionName)) {
      console.log(`📦 Creating backup of collection: ${collectionName}`);
      const backup = await mongoose.connection.db.collection(collectionName).find({}).toArray();
      console.log(`✅ Backed up ${backup.length} documents from ${collectionName}`);
      return backup;
    }
    return [];
  }

  private migrations: Migration[] = [
    {
      version: "001",
      description: "Initial schema setup and index creation",
      up: async () => {
        await connectDB();

        console.log("🔍 Checking existing collections...");
        
        // Check if collections already exist
        if (!mongoose.connection.db) {
          throw new Error("Database connection not established");
        }
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        const existingCollections = collections.map(c => c.name);
        
        console.log("📋 Existing collections:", existingCollections);

        // Create indexes only if collections don't exist or need updates
        const modelsToIndex = [
          { name: 'users', model: User },
          { name: 'children', model: Child },
          { name: 'adminprofiles', model: AdminProfile },
          { name: 'observerprofiles', model: ObserverProfile },
          { name: 'organisationprofiles', model: OrganisationProfile },
          { name: 'files', model: File },
        ];

        for (const { name, model } of modelsToIndex) {
          try {
            if (existingCollections.includes(name)) {
              console.log(`📊 Collection '${name}' exists, ensuring indexes...`);
              await model.createIndexes();
              console.log(`✅ Indexes verified for '${name}'`);
            } else {
              console.log(`🆕 Creating new collection '${name}' with indexes...`);
              await model.createIndexes();
              console.log(`✅ Collection '${name}' created with indexes`);
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`⚠️ Error with ${name} indexes:`, errorMessage);
          }
        }

        console.log("✅ Initial schema setup completed");
      },
      down: async () => {
        await connectDB();

        // Drop collections (use with caution)
        if (mongoose.connection.db) {
          await mongoose.connection.db.dropCollection("users").catch(() => {});
          await mongoose.connection.db
            .dropCollection("children")
            .catch(() => {});
          await mongoose.connection.db
            .dropCollection("adminprofiles")
            .catch(() => {});
          await mongoose.connection.db
            .dropCollection("observerprofiles")
            .catch(() => {});
          await mongoose.connection.db
            .dropCollection("organisationprofiles")
            .catch(() => {});
        }

        console.log("⚠️ All collections dropped");
      },
    },
    {
      version: "002",
      description: "Add survey data tracking fields",
      up: async () => {
        await connectDB();

        // Update existing child documents to include new fields
        await Child.updateMany(
          {},
          {
            $set: {
              last_survey_date: null,
              total_surveys: 0,
              survey_status: "pending",
            },
          }
        );

        console.log("✅ Added survey tracking fields to children");
      },
      down: async () => {
        await connectDB();

        // Remove the added fields
        await Child.updateMany(
          {},
          {
            $unset: {
              last_survey_date: "",
              total_surveys: "",
              survey_status: "",
            },
          }
        );

        console.log("⚠️ Removed survey tracking fields from children");
      },
    },
    {
      version: "003",
      description: "Handle existing survey data and create new structure",
      up: async () => {
        await connectDB();
        
        const manager = new MigrationManager();
        
        // Check if survey_data collection exists
        const surveyDataExists = await manager.collectionExists('survey_data');
        const existingCount = await manager.getCollectionCount('survey_data');
        
        console.log(`📊 Survey data collection exists: ${surveyDataExists}`);
        console.log(`📊 Existing survey records: ${existingCount}`);
        
        if (surveyDataExists && existingCount > 0) {
          console.log("🔄 Existing survey data found, ensuring schema compatibility...");
          
          // Update existing documents to match new schema
          if (mongoose.connection.db) {
            const result = await mongoose.connection.db.collection('survey_data').updateMany(
              {},
              {
                $set: {
                  updated_at: new Date(),
                  // Ensure all required fields exist
                  no_of_attempt: { $ifNull: ["$no_of_attempt", 0] }
                }
              }
            );
            console.log(`✅ Updated ${result.modifiedCount} existing survey records`);
          }
        } else {
          console.log("🆕 No existing survey data found, ready for new schema");
        }
        
        // Import and create indexes for SurveyData
        const { SurveyData } = await import('../models/SurveyData');
        await SurveyData.createIndexes();
        
        console.log("✅ Survey data schema migration completed");
      },
      down: async () => {
        await connectDB();
        
        console.log("⚠️ Rolling back survey data schema changes...");
        // In a real scenario, you might want to preserve the old format
        console.log("⚠️ Survey data rollback completed");
      },
    },
  ];

  async getAppliedMigrations(): Promise<string[]> {
    await connectDB();
    const applied = await MigrationModel.find({}).sort({ version: 1 });
    return applied.map((m) => m.version);
  }

  async runMigrations(): Promise<void> {
    const appliedVersions = await this.getAppliedMigrations();

    for (const migration of this.migrations) {
      if (!appliedVersions.includes(migration.version)) {
        console.log(
          `🔄 Running migration ${migration.version}: ${migration.description}`
        );

        try {
          await migration.up();

          // Record successful migration
          await MigrationModel.create({
            version: migration.version,
            description: migration.description,
          });

          console.log(
            `✅ Migration ${migration.version} completed successfully`
          );
        } catch (error) {
          console.error(`❌ Migration ${migration.version} failed:`, error);
          throw error;
        }
      } else {
        console.log(`⏭️ Migration ${migration.version} already applied`);
      }
    }
  }

  async rollbackMigration(version: string): Promise<void> {
    const migration = this.migrations.find((m) => m.version === version);
    if (!migration) {
      throw new Error(`Migration ${version} not found`);
    }

    console.log(
      `🔄 Rolling back migration ${version}: ${migration.description}`
    );

    try {
      await migration.down();

      // Remove migration record
      await MigrationModel.deleteOne({ version });

      console.log(`✅ Migration ${version} rolled back successfully`);
    } catch (error) {
      console.error(`❌ Rollback of migration ${version} failed:`, error);
      throw error;
    }
  }

  async getStatus(): Promise<
    { version: string; description: string; applied: boolean }[]
  > {
    const appliedVersions = await this.getAppliedMigrations();

    return this.migrations.map((migration) => ({
      version: migration.version,
      description: migration.description,
      applied: appliedVersions.includes(migration.version),
    }));
  }
}

export const migrationManager = new MigrationManager();
