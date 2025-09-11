import connectDB from "./mongodb";
import AppConfig from "../config/app.config";
import User from "../models/user.model";
import AdminProfile from "../models/admin.profle.model";
import OrganisationProfile from "../models/organisation.profile.model";

export interface Migration {
  version: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

import mongoose from "mongoose";

export class MigrationManager {
  /**
   * Get the target database name from configuration
   */
  getTargetDatabaseName(): string {
    return AppConfig.DATABASE.MONGODB_DB_NAME;
  }

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
        if (!mongoose.connection.db) {
          throw new Error("Database connection not established");
        }
        const collections = await mongoose.connection.db
          .listCollections()
          .toArray();
        const existingCollections = collections.map((c) => c.name);
        console.log("Existing collections:", existingCollections);
        const modelsToIndex = [
          { name: "users", model: User },
          { name: "adminprofiles", model: AdminProfile },
          { name: "organisationprofiles", model: OrganisationProfile },
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
        if (mongoose.connection.db) {
          await mongoose.connection.db.dropCollection("users").catch(() => {});
          await mongoose.connection.db
            .dropCollection("adminprofiles")
            .catch(() => {});
          await mongoose.connection.db
            .dropCollection("organisationprofiles")
            .catch(() => {});
        }
        console.log("⚠️ All collections dropped");
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
          validateDummyDataConsistency,
        } = await import("../models/dummyData");

        // Validate data consistency before seeding
        console.log("🔍 Validating dummy data consistency...");
        const isDataValid = validateDummyDataConsistency();
        if (!isDataValid) {
          throw new Error(
            "Dummy data validation failed. Cannot proceed with seeding."
          );
        }

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
        const adminUsers = createdUsers.filter((u) => u.role === "admin");

        if (adminUsers.length !== dummyAdminProfiles.length) {
          throw new Error(
            `Admin user count (${adminUsers.length}) doesn't match admin profile count (${dummyAdminProfiles.length})`
          );
        }

        const adminProfileData = dummyAdminProfiles.map((profile, index) => ({
          ...profile,
          user_id: adminUsers[index]._id,
        }));

        const createdAdminProfiles = await AdminProfile.insertMany(
          adminProfileData
        );
        console.log(`✅ Created ${createdAdminProfiles.length} admin profiles`);

        // Create organisation profiles
        console.log("🏢 Creating organisation profiles...");
        const orgUsers = createdUsers.filter((u) => u.role === "organisation");

        if (orgUsers.length !== dummyOrganisationProfiles.length) {
          throw new Error(
            `Organisation user count (${orgUsers.length}) doesn't match organisation profile count (${dummyOrganisationProfiles.length})`
          );
        }

        const orgProfileData = dummyOrganisationProfiles.map(
          (profile, index) => ({
            ...profile,
            user_id: orgUsers[index]._id,
          })
        );

        const createdOrgProfiles = await OrganisationProfile.insertMany(
          orgProfileData
        );
        console.log(
          `✅ Created ${createdOrgProfiles.length} organisation profiles`
        );

        console.log("🎉 Database seeding completed successfully!");
        console.log(`
        📈 Summary:
        - Users: ${createdUsers.length}
        - Admin Profiles: ${createdAdminProfiles.length}  
        - Organisation Profiles: ${createdOrgProfiles.length}
        `);
      },
      down: async () => {
        await connectDB();

        console.log("🗑️ Removing all seeded data...");

        // Remove in reverse order due to dependencies
        await OrganisationProfile.deleteMany({});
        await AdminProfile.deleteMany({});
        await User.deleteMany({});

        console.log("✅ All seeded data removed");
      },
    },

    {
      version: "006",
      description: "Remove unique_id field from OrganisationProfile collection",
      up: async () => {
        await connectDB();

        console.log(
          "🔄 Removing unique_id field from organisation_profiles..."
        );

        // Check if organisation_profiles collection exists
        const collectionExists = await this.collectionExists(
          "organisation_profiles"
        );
        if (!collectionExists) {
          console.log(
            "📊 organisation_profiles collection doesn't exist, skipping"
          );
          return;
        }

        if (mongoose.connection.db) {
          // Drop the unique_id index first (before removing the field)
          try {
            await mongoose.connection.db
              .collection("organisation_profiles")
              .dropIndex("unique_id_1");
            console.log("✅ Dropped unique_id index");
          } catch (error) {
            console.log("⚠️ unique_id index not found or already dropped");
          }

          // Now remove unique_id field from all documents
          const result = await mongoose.connection.db
            .collection("organisation_profiles")
            .updateMany({}, { $unset: { unique_id: "" } });

          console.log(
            `✅ Removed unique_id field from ${result.modifiedCount} documents`
          );
        }

        console.log("✅ unique_id field removal completed");
      },
      down: async () => {
        await connectDB();

        console.log(
          "⚠️ Rollback: Adding back unique_id field is not recommended"
        );
        console.log(
          "⚠️ This would require regenerating unique IDs for all documents"
        );
        console.log("⚠️ Rollback completed (no action taken)");
      },
    },

    {
      version: "008",
      description: "Add email field to OrganisationProfile collection",
      up: async () => {
        await connectDB();

        console.log(
          "📧 Adding email field to OrganisationProfile collection..."
        );

        // Check if the collection exists
        const collectionExists = await this.collectionExists(
          "organisation_profiles"
        );
        if (!collectionExists) {
          console.log(
            "📊 organisation_profiles collection doesn't exist, skipping"
          );
          return;
        }

        const db = mongoose.connection.db;
        if (!db) {
          throw new Error("Database connection not available");
        }

        // Get all organisation profiles that don't have email field
        const profilesWithoutEmail = await db
          .collection("organisation_profiles")
          .find({ email: { $exists: false } })
          .toArray();

        if (profilesWithoutEmail.length === 0) {
          console.log("📊 All organisation profiles already have email field");
          return;
        }

        console.log(
          `📧 Found ${profilesWithoutEmail.length} profiles without email field`
        );

        // Update each profile by fetching email from associated user
        for (const profile of profilesWithoutEmail) {
          try {
            const user = await db
              .collection("users")
              .findOne({ _id: profile.user_id });
            if (user && user.email) {
              await db
                .collection("organisation_profiles")
                .updateOne(
                  { _id: profile._id },
                  { $set: { email: user.email } }
                );
              console.log(
                `✅ Updated profile ${profile._id} with email ${user.email}`
              );
            } else {
              console.log(`⚠️ No user found for profile ${profile._id}`);
            }
          } catch (error) {
            console.log(`❌ Error updating profile ${profile._id}:`, error);
          }
        }

        // Create unique index on email
        try {
          await db
            .collection("organisation_profiles")
            .createIndex({ email: 1 }, { unique: true });
          console.log("✅ Created unique index on email field");
        } catch (error: any) {
          if (error.code === 85) {
            console.log("📊 Email unique index already exists");
          } else {
            console.log("⚠️ Error creating email unique index:", error.message);
          }
        }

        console.log("✅ Email field addition completed");
      },
      down: async () => {
        await connectDB();

        console.log(
          "🔄 Removing email field from OrganisationProfile collection..."
        );

        const db = mongoose.connection.db;
        if (!db) {
          throw new Error("Database connection not available");
        }

        // Drop email index
        try {
          await db.collection("organisation_profiles").dropIndex("email_1");
          console.log("✅ Dropped email index");
        } catch (error: any) {
          if (error.code === 27) {
            console.log("📊 Email index doesn't exist, skipping drop");
          } else {
            console.log("⚠️ Error dropping email index:", error.message);
          }
        }

        // Remove email field from all documents
        const result = await db
          .collection("organisation_profiles")
          .updateMany({}, { $unset: { email: "" } });

        console.log(
          `✅ Removed email field from ${result.modifiedCount} documents`
        );
      },
    },
  ];

  async getAppliedMigrations(): Promise<string[]> {
    // No migration tracking - always return empty array to run all migrations
    return [];
  }

  async runMigrations(): Promise<void> {
    try {
      for (const migration of this.migrations) {
        console.log(
          `🔄 Running migration ${migration.version}: ${migration.description}`
        );

        try {
          await migration.up();
          console.log(
            `✅ Migration ${migration.version} completed successfully`
          );
        } catch (error) {
          console.error(`❌ Migration ${migration.version} failed:`, error);
          throw error;
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("EBADRESP")) {
        console.error("❌ MongoDB connection failed. Please check:");
        console.error("  - Your internet connection");
        console.error("  - MongoDB Atlas cluster status");
        console.error("  - IP whitelist settings in MongoDB Atlas");
        console.error("  - Connection string in .env.local");
      }
      throw error;
    }
  }


  async getStatus(): Promise<
    { version: string; description: string; applied: boolean }[]
  > {
    // Since we don't track migrations, show all as available to run
    return this.migrations.map((migration) => ({
      version: migration.version,
      description: migration.description,
      applied: false, // Always show as not applied since we don't track
    }));
  }
}

export const migrationManager = new MigrationManager();