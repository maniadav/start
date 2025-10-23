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
    ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID || "",
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY_ID || "",
  };

  static readonly GMAIL = {
    EMAIL_ID: process.env.GOOGLE_SMTP_EMAIL_ID || "",
    SMTP_CLIENT_ID: process.env.GOOGLE_SMTP_CLIENT_ID || "",
    SMTP_CLIENT_SECRET: process.env.GOOGLE_SMTP_CLIENT_SECRET || "",
    SMTP_REFRESH_TOKEN: process.env.GOOGLE_SMTP_REFRESH_TOKEN || "",
  };

  // Database Configuration
  static readonly DATABASE = {
    MONGODB_URI: process.env.MONGODB_URI || "",
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "",
  };

  // JWT Configuration
  static readonly JWT = {
    JWT_SECRET: process.env.JWT_SECRET || "",
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
    START_APP_BASE_URL: process.env.START_APP_BASE_URL || "https://startweb.vercel.app",
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

    // AWS configuration (warnings for non-critical)
    if (!this.AWS.BUCKET_NAME) {
      warnings.push(
        "AWS_BUCKET_NAME not set - file upload functionality will be disabled"
      );
    }
    if (!this.AWS.BUCKET_REGION) {
      warnings.push(
        "AWS_BUCKET_REGION not set - file upload functionality will be disabled"
      );
    }
    if (!this.AWS.ACCESS_KEY) {
      warnings.push(
        "AWS_ACCESS_KEY_ID not set - file upload functionality will be disabled"
      );
    }
    if (!this.AWS.SECRET_ACCESS_KEY) {
      warnings.push(
        "AWS_SECRET_ACCESS_KEY_ID not set - file upload functionality will be disabled"
      );
    }

    // Database configuration (warnings for non-critical)
    if (!this.DATABASE.MONGODB_URI) {
      warnings.push(
        "MONGODB_URI not set - database functionality will be disabled"
      );
    }
    if (!this.DATABASE.MONGODB_DB_NAME) {
      warnings.push(
        "MONGODB_DB_NAME not set - database functionality will be disabled"
      );
    }

    // Critical JWT configuration
    if (!this.JWT.JWT_SECRET) {
      errors.push("JWT_SECRET is required for authentication");
    }

    // Critical Gmail configuration
    if (!this.GMAIL.EMAIL_ID) {
      errors.push("GOOGLE_SMTP_EMAIL_ID is required for Gmail SMTP");
    }
    if (!this.GMAIL.SMTP_CLIENT_ID) {
      errors.push("GOOGLE_SMTP_CLIENT_ID is required for Gmail SMTP");
    }
    if (!this.GMAIL.SMTP_CLIENT_SECRET) {
      errors.push("GOOGLE_SMTP_CLIENT_SECRET is required for Gmail SMTP");
    }
    if (!this.GMAIL.SMTP_REFRESH_TOKEN) {
      errors.push("GOOGLE_SMTP_REFRESH_TOKEN is required for Gmail SMTP");
    }

    // Legacy Email configuration (warnings for non-critical)
    if (!this.EMAIL.SMTP_HOST) {
      warnings.push(
        "SMTP_HOST not set - legacy email functionality will be disabled"
      );
    }
    if (!this.EMAIL.SMTP_USER) {
      warnings.push(
        "SMTP_USER not set - legacy email functionality will be disabled"
      );
    }
    if (!this.EMAIL.SMTP_PASS) {
      warnings.push(
        "SMTP_PASS not set - legacy email functionality will be disabled"
      );
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
      `   Database: ${
        this.DATABASE.MONGODB_DB_NAME ? "Configured" : "Not configured"
      }`
    );
    console.log(
      `   AWS S3: ${this.AWS.BUCKET_NAME ? "Configured" : "Not configured"}`
    );
    console.log(
      `   JWT: ${this.JWT.JWT_SECRET ? "Configured" : "Not configured"}`
    );
    console.log(
      `   Gmail SMTP: ${
        this.GMAIL.EMAIL_ID &&
        this.GMAIL.SMTP_CLIENT_ID &&
        this.GMAIL.SMTP_CLIENT_SECRET &&
        this.GMAIL.SMTP_REFRESH_TOKEN
          ? "Configured"
          : "Not configured"
      }`
    );
    console.log(
      `   Legacy Email: ${
        this.EMAIL.SMTP_HOST ? "Configured" : "Not configured"
      }`
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

  /**
   * Checks if Gmail SMTP is properly configured
   */
  static isGmailConfigured(): boolean {
    return !!(
      this.GMAIL.EMAIL_ID &&
      this.GMAIL.SMTP_CLIENT_ID &&
      this.GMAIL.SMTP_CLIENT_SECRET &&
      this.GMAIL.SMTP_REFRESH_TOKEN
    );
  }

  /**
   * Gets Gmail configuration status
   */
  static getGmailConfigStatus(): {
    isConfigured: boolean;
    missingFields: string[];
  } {
    const missingFields: string[] = [];

    if (!this.GMAIL.EMAIL_ID) missingFields.push("GOOGLE_SMTP_EMAIL_ID");
    if (!this.GMAIL.SMTP_CLIENT_ID) missingFields.push("GOOGLE_SMTP_CLIENT_ID");
    if (!this.GMAIL.SMTP_CLIENT_SECRET)
      missingFields.push("GOOGLE_SMTP_CLIENT_SECRET");
    if (!this.GMAIL.SMTP_REFRESH_TOKEN)
      missingFields.push("GOOGLE_SMTP_REFRESH_TOKEN");

    return {
      isConfigured: missingFields.length === 0,
      missingFields,
    };
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
