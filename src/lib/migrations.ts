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

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    return collections.some((c) => c.name === collectionName);
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
      return await mongoose.connection.db
        .collection(collectionName)
        .countDocuments();
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
      const backup = await mongoose.connection.db
        .collection(collectionName)
        .find({})
        .toArray();
      console.log(
        `✅ Backed up ${backup.length} documents from ${collectionName}`
      );
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

        const collections = await mongoose.connection.db
          .listCollections()
          .toArray();
        const existingCollections = collections.map((c) => c.name);

        console.log("📋 Existing collections:", existingCollections);

        // Create indexes only if collections don't exist or need updates
        const modelsToIndex = [
          { name: "users", model: User },
          { name: "children", model: Child },
          { name: "adminprofiles", model: AdminProfile },
          { name: "observerprofiles", model: ObserverProfile },
          { name: "organisationprofiles", model: OrganisationProfile },
          { name: "files", model: File },
        ];

        for (const { name, model } of modelsToIndex) {
          try {
            if (existingCollections.includes(name)) {
              console.log(
                `📊 Collection '${name}' exists, ensuring indexes...`
              );
              await model.createIndexes();
              console.log(`✅ Indexes verified for '${name}'`);
            } else {
              console.log(
                `🆕 Creating new collection '${name}' with indexes...`
              );
              await model.createIndexes();
              console.log(`✅ Collection '${name}' created with indexes`);
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
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
      description: "Setup SurveyData model indexes",
      up: async () => {
        await connectDB();

        console.log("� Setting up SurveyData model indexes...");

        // Import and create indexes for SurveyData
        const { SurveyData } = await import("../models/SurveyData");
        await SurveyData.createIndexes();

        console.log("✅ SurveyData indexes created successfully");
      },
      down: async () => {
        await connectDB();

        console.log("⚠️ Rolling back SurveyData indexes...");
        // In production, you might want to drop the indexes here
        console.log("⚠️ SurveyData rollback completed");
      },
    },
    {
      version: "004",
      description: "Seed database with initial dummy data",
      up: async () => {
        await connectDB();

        console.log("🌱 Starting database seeding with dummy data...");

        // Import dummy data
        const {
          dummyUsers,
          hashUserPasswords,
          dummyAdminProfiles,
          dummyOrganisationProfiles,
          dummyObserverProfiles,
          dummyChildren,
        } = await import("../models/dummyData");

        // Check if data already exists
        const userCount = await User.countDocuments();
        if (userCount > 0) {
          console.log("📊 Database already contains data, skipping seeding");
          return;
        }

        console.log("🔐 Creating users with hashed passwords...");
        const hashedUsers = await hashUserPasswords();
        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Create admin profiles
        console.log("👤 Creating admin profiles...");
        const adminUser = createdUsers.find((u) => u.role === "admin");
        const adminProfileData = dummyAdminProfiles.map((profile) => ({
          ...profile,
          user_id: adminUser?._id,
        }));
        const createdAdminProfiles = await AdminProfile.insertMany(
          adminProfileData
        );
        console.log(`✅ Created ${createdAdminProfiles.length} admin profiles`);

        // Create organisation profiles
        console.log("🏢 Creating organisation profiles...");
        const orgUsers = createdUsers.filter((u) => u.role === "organisation");
        const orgProfileData = dummyOrganisationProfiles.map(
          (profile, index) => ({
            ...profile,
            user_id: orgUsers[index]?._id,
          })
        );
        const createdOrgProfiles = await OrganisationProfile.insertMany(
          orgProfileData
        );
        console.log(
          `✅ Created ${createdOrgProfiles.length} organisation profiles`
        );

        // Create observer profiles
        console.log("👁️ Creating observer profiles...");
        const observerUsers = createdUsers.filter((u) => u.role === "observer");
        const observerProfileData = dummyObserverProfiles.map(
          (profile, index) => ({
            ...profile,
            user_id: observerUsers[index]?._id,
            organisation_id:
              createdOrgProfiles[index % createdOrgProfiles.length]?._id,
          })
        );
        const createdObserverProfiles = await ObserverProfile.insertMany(
          observerProfileData
        );
        console.log(
          `✅ Created ${createdObserverProfiles.length} observer profiles`
        );

        // Create children
        console.log("👶 Creating child records...");
        const childData = dummyChildren.map((child, index) => ({
          ...child,
          observer_id:
            createdObserverProfiles[index % createdObserverProfiles.length]
              ?._id,
          organisation_id:
            createdOrgProfiles[index % createdOrgProfiles.length]?._id,
        }));
        const createdChildren = await Child.insertMany(childData);
        console.log(`✅ Created ${createdChildren.length} child records`);

        console.log("🎉 Database seeding completed successfully!");
        console.log(`
        📈 Summary:
        - Users: ${createdUsers.length}
        - Admin Profiles: ${createdAdminProfiles.length}  
        - Organisation Profiles: ${createdOrgProfiles.length}
        - Observer Profiles: ${createdObserverProfiles.length}
        - Children: ${createdChildren.length}
        `);
      },
      down: async () => {
        await connectDB();

        console.log("🗑️ Removing all seeded data...");

        // Remove in reverse order due to dependencies
        await Child.deleteMany({});
        await ObserverProfile.deleteMany({});
        await OrganisationProfile.deleteMany({});
        await AdminProfile.deleteMany({});
        await User.deleteMany({});

        console.log("✅ All seeded data removed");
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
