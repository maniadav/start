import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Application Configuration
 * Centralized configuration management with validation and logging
 */
export class AppConfig {
  // AWS Configuration
  static readonly AWS = {
    BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
    BUCKET_REGION: process.env.AWS_BUCKET_REGION || "",
    ACCESS_KEY: process.env.AWS_ACCESS_KEY || "",
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  };

  // Database Configuration
  static readonly DATABASE = {
    MONGODB_URI: process.env.MONGODB_URI || "",
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "",
  };

  // JWT Configuration
  static readonly JWT = {
    SECRET: process.env.JWT_SECRET || "",
    ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m",
    REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d",
    RESET_TOKEN_EXPIRY: process.env.JWT_RESET_TOKEN_EXPIRY || "1h",
    ACTIVATION_TOKEN_EXPIRY: process.env.JWT_ACTIVATION_TOKEN_EXPIRY || "24h",
  };

  // Server Configuration
  static readonly SERVER = {
    PORT: process.env.PORT || "3000",
    NODE_ENV: process.env.NODE_ENV || "development",
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3000",
  };

  // Email Configuration
  static readonly EMAIL = {
    SMTP_HOST: process.env.SMTP_HOST || "",
    SMTP_PORT: process.env.SMTP_PORT || "587",
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
    FROM_EMAIL: process.env.FROM_EMAIL || "",
    FROM_NAME: process.env.FROM_NAME || "",
  };

  // File Upload Configuration
  static readonly UPLOAD = {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "1048576"), // 1MB default
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(",") || [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  };

  // Security Configuration
  static readonly SECURITY = {
    CORS_ORIGIN: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:3000",
    ],
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100"), // 100 requests per window
  };

  // Logging Configuration
  static readonly LOGGING = {
    LEVEL: process.env.LOG_LEVEL || "info",
    ENABLE_FILE_LOGGING: process.env.ENABLE_FILE_LOGGING === "true",
    LOG_FILE_PATH: process.env.LOG_FILE_PATH || "logs/app.log",
  };

  /**
   * Validates all required configuration values
   * Throws error if critical values are missing
   */
  static validate(): void {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Critical AWS configuration
    if (!this.AWS.BUCKET_NAME) {
      errors.push("AWS_BUCKET_NAME is required for file uploads");
    }
    if (!this.AWS.BUCKET_REGION) {
      errors.push("AWS_BUCKET_REGION is required for file uploads");
    }
    if (!this.AWS.ACCESS_KEY) {
      errors.push("AWS_ACCESS_KEY is required for file uploads");
    }
    if (!this.AWS.SECRET_ACCESS_KEY) {
      errors.push("AWS_SECRET_ACCESS_KEY is required for file uploads");
    }

    // Critical Database configuration
    if (!this.DATABASE.MONGODB_URI) {
      errors.push("MONGODB_URI is required for database connection");
    }

    // Critical JWT configuration
    if (!this.JWT.SECRET) {
      errors.push("JWT_SECRET is required for authentication");
    }

    // Critical Email configuration (warnings for non-critical)
    if (!this.EMAIL.SMTP_HOST) {
      warnings.push("SMTP_HOST not set - email functionality will be disabled");
    }
    if (!this.EMAIL.SMTP_USER) {
      warnings.push("SMTP_USER not set - email functionality will be disabled");
    }
    if (!this.EMAIL.SMTP_PASS) {
      warnings.push("SMTP_PASS not set - email functionality will be disabled");
    }

    // Log warnings
    if (warnings.length > 0) {
      console.warn("⚠️  Configuration Warnings:");
      warnings.forEach((warning) => console.warn(`   - ${warning}`));
    }

    // Throw error if critical values are missing
    if (errors.length > 0) {
      console.error("❌ Critical Configuration Errors:");
      errors.forEach((error) => console.error(`   - ${error}`));
      throw new Error(`Configuration validation failed: ${errors.join(", ")}`);
    }

    console.log("✅ Configuration validation passed");
  }

  /**
   * Logs current configuration (without sensitive data)
   */
  static logConfiguration(): void {
    console.log("🔧 Application Configuration:");
    console.log(`   Environment: ${this.SERVER.NODE_ENV}`);
    console.log(`   Port: ${this.SERVER.PORT}`);
    console.log(
      `   Database: ${
        this.DATABASE.MONGODB_URI ? "Configured" : "Not configured"
      }`
    );
    console.log(
      `   AWS S3: ${this.AWS.BUCKET_NAME ? "Configured" : "Not configured"}`
    );
    console.log(`   JWT: ${this.JWT.SECRET ? "Configured" : "Not configured"}`);
    console.log(
      `   Email: ${this.EMAIL.SMTP_HOST ? "Configured" : "Not configured"}`
    );
    console.log(
      `   Max File Size: ${this.UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB`
    );
    console.log(
      `   Allowed File Types: ${this.UPLOAD.ALLOWED_FILE_TYPES.length} types`
    );
  }

  /**
   * Gets configuration for a specific module
   */
  static getModuleConfig(module: keyof typeof AppConfig): any {
    return this[module];
  }

  /**
   * Checks if running in production
   */
  static isProduction(): boolean {
    return this.SERVER.NODE_ENV === "production";
  }

  /**
   * Checks if running in development
   */
  static isDevelopment(): boolean {
    return this.SERVER.NODE_ENV === "development";
  }
}

// Auto-validate configuration on import
if (typeof window === "undefined") {
  // Only run validation on server-side
  try {
    AppConfig.validate();
    AppConfig.logConfiguration();
  } catch (error) {
    console.error("Failed to start application due to configuration errors:");
    console.error(error);
    process.exit(1);
  }
}

export default AppConfig;
