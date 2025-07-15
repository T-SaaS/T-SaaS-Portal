import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { insertDriverApplicationSchema } from "@shared/schema";
import express, { json } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { db, supabase } from "./db";
import { resolvers, typeDefs } from "./graphql/schema";

export async function registerRoutes(app: express.Express): Promise<Server> {
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server
  await server.start();

  // Apply Apollo middleware
  app.use("/graphql", json(), expressMiddleware(server));

  // Submit driver application
  app.post("/api/v1/driver-applications", async (req, res) => {
    try {
      // Capture IP address
      const ipAddress =
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        req.headers["x-real-ip"]?.toString() ||
        "unknown";

      // Extract device info from request body if provided
      const { deviceInfo, ...applicationData } = req.body;

      console.log("Application submission request:", {
        hasDeviceInfo: !!deviceInfo,
        ipAddress,
        deviceInfo: deviceInfo
          ? {
              deviceType: deviceInfo.deviceType,
              os: deviceInfo.os,
              browser: deviceInfo.browser,
              isMobile: deviceInfo.isMobile,
            }
          : null,
      });

      // Add device info and IP address to the application data
      const dataWithDeviceInfo = {
        ...applicationData,
        deviceInfo,
        ipAddress,
      };

      const validatedData =
        insertDriverApplicationSchema.parse(dataWithDeviceInfo);
      const application = await db.createDriverApplication(validatedData);
      console.log("Application created successfully:", {
        id: application.id,
        companyId: application.company_id,
        ipAddress,
        deviceType: deviceInfo?.deviceType,
      });

      // Initiate background check process
      if (application.consentToBackgroundCheck === 1) {
        console.log("Background check consent given, initiating process...");
        // backgroundCheckService.initiateBackgroundCheck(application.id);
      }

      res.status(201).json({
        success: true,
        message: "Driver application submitted successfully",
        data: application,
      });
    } catch (error) {
      console.error("Error in POST /api/driver-applications:", {
        error: error instanceof Error ? error.message : JSON.stringify(error),
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        });
      } else if (error instanceof Error) {
        // Check for specific database errors
        if (error.message.includes("duplicate key")) {
          res.status(409).json({
            success: false,
            message: "Application already exists",
            error: "DUPLICATE_APPLICATION",
          });
        } else if (error.message.includes("foreign key")) {
          res.status(400).json({
            success: false,
            message: "Invalid company ID",
            error: "INVALID_COMPANY",
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: "UNKNOWN_ERROR",
        });
      }
    }
  });

  // Get all driver applications
  app.get("/api/v1/driver-applications", async (req, res) => {
    try {
      console.log("Fetching all driver applications...");

      const applications = await db.getAllDriverApplications();
      console.log(`Retrieved ${applications.length} applications`);

      res.json({
        success: true,
        message: `Retrieved ${applications.length} applications`,
        data: applications,
      });
    } catch (error) {
      console.error("Error in GET /api/driver-applications:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Failed to retrieve applications",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get driver application by ID
  app.get("/api/v1/driver-applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID",
          error: "INVALID_ID",
        });
      }

      console.log(`Fetching driver application with ID: ${id}`);

      const application = await db.getDriverApplication(id);

      if (!application) {
        console.log(`Application with ID ${id} not found`);
        return res.status(404).json({
          success: false,
          message: "Application not found",
          error: "NOT_FOUND",
        });
      }

      console.log(
        `Retrieved application: ${application.first_name} ${application.last_name}`
      );

      res.json({
        success: true,
        message: "Application retrieved successfully",
        data: application,
      });
    } catch (error) {
      console.error(`Error in GET /api/driver-applications/${req.params.id}:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        id: req.params.id,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Failed to retrieve application",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Update driver application
  app.put("/api/v1/driver-applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // For signature updates, we only need to validate the signature fields
      // Check if this is a signature-only update
      const hasSignatureFields =
        req.body.background_check_consent_signature ||
        req.body.employment_consent_signature ||
        req.body.drug_test_consent_signature ||
        req.body.motor_vehicle_record_consent_signature ||
        req.body.general_consent_signature;

      let validatedData;

      if (hasSignatureFields) {
        // This is a signature update - only validate signature fields
        const signatureUpdateSchema = z.object({
          background_check_consent_signature: z
            .object({
              data: z.string().nullable(),
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
          employment_consent_signature: z
            .object({
              data: z.string().nullable(),
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
          drug_test_consent_signature: z
            .object({
              data: z.string().nullable(),
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
          motor_vehicle_record_consent_signature: z
            .object({
              data: z.string().nullable(),
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
          general_consent_signature: z
            .object({
              data: z.string().nullable(),
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
        });

        validatedData = signatureUpdateSchema.parse(req.body);
      } else {
        // This is a full application update - validate all fields
        validatedData = insertDriverApplicationSchema.parse(req.body);
      }

      console.log("Validated data:", validatedData);
      const application = await db.updateDriverApplication(id, validatedData);
      res.json({
        success: true,
        message: "Application updated successfully",
        data: application,
      });
    } catch (error) {
      console.error(
        `Error in PUT /api/v1/driver-applications/${req.params.id}:`,
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          id: req.params.id,
          timestamp: new Date().toISOString(),
        }
      );

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update application",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  });

  // Get background check status
  app.get("/api/driver-applications/:id/background-check", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID",
          error: "INVALID_ID",
        });
      }

      console.log(`Fetching background check status for application ID: ${id}`);

      // First check if the application exists
      const application = await db.getDriverApplication(id);
      if (!application) {
        console.log(`Application with ID ${id} not found`);
        return res.status(404).json({
          success: false,
          message: "Application not found",
          error: "NOT_FOUND",
        });
      }

      // TODO: Implement background check service
      // const status = await backgroundCheckService.getBackgroundCheckStatus(id);

      console.log(
        `Background check status requested for: ${application.first_name} ${application.last_name}`
      );

      res.json({
        success: true,
        message: "Background check status retrieved",
        data: {
          applicationId: id,
          status: application.background_check_status || "pending",
          lastUpdated: application.background_check_completed_at || null,
          note: "Background check service not yet implemented",
        },
      });
    } catch (error) {
      console.error(
        `Error in GET /api/driver-applications/${req.params.id}/background-check:`,
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          id: req.params.id,
          timestamp: new Date().toISOString(),
        }
      );

      res.status(500).json({
        success: false,
        message: "Failed to retrieve background check status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Upload signature
  app.post("/api/v1/signatures/upload", async (req, res) => {
    try {
      const { signatureData, applicationId, companyName, signatureType } =
        req.body;

      if (!signatureData || !applicationId || !companyName || !signatureType) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: signatureData, applicationId, companyName, signatureType",
        });
      }

      console.log("Signature upload request:", {
        applicationId,
        companyName,
        signatureType,
        hasSignatureData: !!signatureData,
      });

      // Try to upload to Supabase Storage first
      let uploadSuccess = false;
      let storageData = null;

      try {
        // Convert data URL to blob
        const response = await fetch(signatureData);
        const blob = await response.blob();

        // Create file path with signature type
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${applicationId}-${signatureType}-${timestamp}.png`;
        const filePath = `${companyName}/${fileName}`;

        console.log("Uploading signature to path:", filePath);

        // First, check if the bucket exists and we have access
        const { data: buckets, error: bucketsError } =
          await supabase.storage.listBuckets();

        if (bucketsError) {
          console.error("Error listing buckets:", bucketsError);
          throw new Error("Failed to access storage buckets");
        }

        console.log(
          "Available buckets:",
          buckets?.map((b) => b.name)
        );

        // Check if application-signatures bucket exists
        const signaturesBucket = buckets?.find(
          (b) => b.name === "application-signatures"
        );
        if (!signaturesBucket) {
          console.error("application-signatures bucket not found");
          throw new Error("Storage bucket not configured");
        }

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("application-signatures")
          .upload(filePath, blob, {
            contentType: "image/png",
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Supabase upload error:", error);
          throw error;
        }

        console.log("Signature uploaded successfully:", data);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("application-signatures")
          .getPublicUrl(filePath);

        // Get signed URL (valid for 1 hour)
        const { data: signedUrlData } = await supabase.storage
          .from("application-signatures")
          .createSignedUrl(filePath, 60 * 60); // 1 hour

        storageData = {
          url: urlData.publicUrl,
          signedUrl: signedUrlData?.signedUrl,
          path: filePath,
          timestamp: new Date().toISOString(),
        };

        uploadSuccess = true;
      } catch (storageError) {
        console.error(
          "Storage upload failed, falling back to database storage:",
          storageError
        );

        // Fallback: Store signature data directly in database
        storageData = {
          url: null,
          signedUrl: null,
          path: null,
          data: signatureData, // Store the actual signature data
          timestamp: new Date().toISOString(),
        };

        uploadSuccess = true; // Still consider it successful
      }

      res.json({
        success: true,
        message: uploadSuccess
          ? "Signature uploaded successfully"
          : "Signature stored in database",
        data: {
          ...storageData,
          signatureType,
          storedInDatabase: !storageData.url, // Flag to indicate if stored in DB
        },
      });
    } catch (error) {
      console.error("Error in POST /api/v1/signatures/upload:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Failed to upload signature",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get all companies
  app.get("/api/v1/companies", async (req, res) => {
    try {
      console.log("Fetching all companies...");

      const companies = await db.getAllCompanies();
      console.log(`Retrieved ${companies.length} companies`);

      res.json({
        success: true,
        message: `Retrieved ${companies.length} companies`,
        data: companies,
      });
    } catch (error) {
      console.error("Error in GET /api/v1/companies:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Failed to retrieve companies",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get company by slug
  app.get("/api/v1/companies/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;

      if (!slug) {
        return res.status(400).json({
          success: false,
          message: "Company slug is required",
          error: "MISSING_SLUG",
        });
      }

      console.log(`Fetching company by slug: ${slug}`);

      const company = await db.getCompanyBySlug(slug);

      if (!company) {
        console.log(`Company with slug ${slug} not found`);
        return res.status(404).json({
          success: false,
          message: "Company not found",
          error: "NOT_FOUND",
        });
      }

      console.log(`Retrieved company: ${company.name}`);

      res.json({
        success: true,
        message: "Company retrieved successfully",
        data: company,
      });
    } catch (error) {
      console.error(`Error in GET /api/companies/slug/${req.params.slug}:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        slug: req.params.slug,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Failed to retrieve company",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get company by ID (for internal use)
  app.get("/api/v1/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Company ID is required",
          error: "MISSING_ID",
        });
      }

      console.log(`Fetching company by ID: ${id}`);

      const company = await db.getCompanyById(id);

      if (!company) {
        console.log(`Company with ID ${id} not found`);
        return res.status(404).json({
          success: false,
          message: "Company not found",
          error: "NOT_FOUND",
        });
      }

      console.log(`Retrieved company: ${company.name}`);

      res.json({
        success: true,
        message: "Company retrieved successfully",
        data: company,
      });
    } catch (error) {
      console.error(`Error in GET /api/companies/${req.params.id}:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        id: req.params.id,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Failed to retrieve company",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
