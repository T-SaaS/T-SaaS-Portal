import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { insertDriverApplicationSchema } from "@shared/schema";
import express, { json } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { db, supabase } from "./db";
import { resolvers, typeDefs } from "./graphql/schema";
import { emailService, EmailTemplateType } from "./services/emailService";
import { getSignaturesForEditing } from "./utils/signatureUtils";

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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });

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
      const { device_info, ...applicationData } = req.body;

      console.log("Application submission request:", {
        hasDeviceInfo: !!device_info,
        ipAddress,
        deviceInfo: device_info
          ? {
              deviceType: device_info.deviceType,
              os: device_info.os,
              browser: device_info.browser,
              isMobile: device_info.isMobile,
            }
          : null,
      });

      // Add device info and IP address to the application data
      const dataWithDeviceInfo = {
        ...applicationData,
        device_info,
        ip_address: ipAddress,
      };

      const validatedData =
        insertDriverApplicationSchema.parse(dataWithDeviceInfo);
      const application = await db.createDriverApplication(validatedData);
      console.log("Application created successfully:", {
        id: application.id,
        companyId: application.company_id,
        ipAddress,
        deviceType: device_info?.deviceType,
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

      // Check if this is a document photo update
      const hasDocumentPhotoFields =
        req.body.license_photo || req.body.medical_card_photo;

      let validatedData;

      if (hasSignatureFields) {
        // This is a signature update - only validate signature fields
        // For updates, we don't need the data field since it's already uploaded
        const signatureUpdateSchema = z.object({
          background_check_consent_signature: z
            .object({
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
          employment_consent_signature: z
            .object({
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
          drug_test_consent_signature: z
            .object({
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
          motor_vehicle_record_consent_signature: z
            .object({
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
          general_consent_signature: z
            .object({
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
            })
            .optional(),
        });

        validatedData = signatureUpdateSchema.parse(req.body);
      } else if (hasDocumentPhotoFields) {
        // This is a document photo update - only validate document photo fields
        const documentPhotoUpdateSchema = z.object({
          license_photo: z
            .object({
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
              filename: z.string().optional(),
              contentType: z.string().optional(),
              size: z.number().optional(),
            })
            .optional(),
          medical_card_photo: z
            .object({
              uploaded: z.boolean(),
              url: z.string().optional(),
              signedUrl: z.string().optional(),
              path: z.string().optional(),
              timestamp: z.string().optional(),
              filename: z.string().optional(),
              contentType: z.string().optional(),
              size: z.number().optional(),
            })
            .optional(),
        });

        validatedData = documentPhotoUpdateSchema.parse(req.body);
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

  // Upload document photo (license or medical card)
  app.post("/api/v1/documents/upload", async (req, res) => {
    try {
      const {
        photoData,
        applicationId,
        companyName,
        documentType,
        filename,
        contentType,
      } = req.body;

      if (!photoData || !applicationId || !companyName || !documentType) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: photoData, applicationId, companyName, documentType",
        });
      }

      console.log("Document photo upload request:", {
        applicationId,
        companyName,
        documentType,
        filename,
        contentType,
        hasPhotoData: !!photoData,
      });

      // Try to upload to Supabase Storage
      let uploadSuccess = false;
      let storageData = null;

      try {
        // Convert data URL to blob
        const response = await fetch(photoData);
        const blob = await response.blob();

        // Create file path with document type
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const safeFilename = filename || `${documentType}-${timestamp}`;
        const fileExtension = contentType?.split("/")[1] || "jpg";
        const fileName = `${applicationId}-${documentType}-${timestamp}.${fileExtension}`;
        const filePath = `${companyName}/${fileName}`;

        console.log("Uploading document to path:", filePath);

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

        // Check if driver-file-documents bucket exists, create if not
        const documentsBucket = buckets?.find(
          (b) => b.name === "driver-file-documents"
        );
        if (!documentsBucket) {
          console.log("driver-file-documents bucket not found, creating...");
          const { error: createError } = await supabase.storage.createBucket(
            "driver-file-documents",
            {
              public: false, // Keep documents private
              allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg"],
              fileSizeLimit: 5242880, // 5MB limit
            }
          );

          if (createError) {
            console.error("Error creating bucket:", createError);
            throw new Error("Failed to create storage bucket");
          }
        }

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("driver-file-documents")
          .upload(filePath, blob, {
            contentType: contentType || "image/jpeg",
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Supabase upload error:", error);
          throw error;
        }

        console.log("Document uploaded successfully:", data);

        // Get signed URL (valid for 1 hour) - documents are private
        const { data: signedUrlData } = await supabase.storage
          .from("driver-file-documents")
          .createSignedUrl(filePath, 60 * 60); // 1 hour

        storageData = {
          uploaded: true,
          url: null, // No public URL for documents
          signedUrl: signedUrlData?.signedUrl,
          path: filePath,
          timestamp: new Date().toISOString(),
          filename: safeFilename,
          contentType: contentType || "image/jpeg",
          size: blob.size,
        };

        uploadSuccess = true;
      } catch (storageError) {
        console.error("Storage upload failed:", storageError);
        throw storageError; // Don't fallback to database for documents
      }

      res.json({
        success: true,
        message: "Document uploaded successfully",
        data: {
          ...storageData,
          documentType,
        },
      });
    } catch (error) {
      console.error("Error in POST /api/v1/documents/upload:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Failed to upload document",
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

  // Get signatures for editing (retrieves base64 data from storage)
  app.get(
    "/api/v1/driver-applications/:id/signatures/for-editing",
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid application ID",
            error: "INVALID_ID",
          });
        }

        console.log(`Fetching signatures for editing - application ID: ${id}`);

        // Get the application with signature data
        const application = await db.getDriverApplication(id);
        if (!application) {
          console.log(`Application with ID ${id} not found`);
          return res.status(404).json({
            success: false,
            message: "Application not found",
            error: "NOT_FOUND",
          });
        }

        // Extract signature data
        const signatureData = {
          background_check_consent_signature:
            application.background_check_consent_signature,
          employment_consent_signature:
            application.employment_consent_signature,
          drug_test_consent_signature: application.drug_test_consent_signature,
          motor_vehicle_record_consent_signature:
            application.motor_vehicle_record_consent_signature,
          general_consent_signature: application.general_consent_signature,
        };

        // Retrieve base64 data for all signatures
        const signaturesForEditing = await getSignaturesForEditing(
          signatureData
        );

        console.log(
          `Retrieved ${
            Object.keys(signaturesForEditing).filter(
              (k) => signaturesForEditing[k]
            ).length
          } signatures for editing`
        );

        res.json({
          success: true,
          message: "Signatures retrieved for editing",
          data: {
            applicationId: id,
            signatures: signaturesForEditing,
          },
        });
      } catch (error) {
        console.error(
          `Error in GET /api/v1/driver-applications/${req.params.id}/signatures/for-editing:`,
          {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            id: req.params.id,
            timestamp: new Date().toISOString(),
          }
        );

        res.status(500).json({
          success: false,
          message: "Failed to retrieve signatures for editing",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  // Email API Routes
  // ===============

  // Send template email
  app.post("/api/v1/emails/send-template", async (req, res) => {
    try {
      const { templateType, context, options } = req.body;

      // Validate required fields
      if (!templateType || !context) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: templateType and context",
          error: "MISSING_REQUIRED_FIELDS",
        });
      }

      // Validate template type
      if (!Object.values(EmailTemplateType).includes(templateType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid template type",
          error: "INVALID_TEMPLATE_TYPE",
          validTypes: Object.values(EmailTemplateType),
        });
      }

      console.log(`Sending template email: ${templateType}`, {
        driverId: context.driver?.id,
        driverEmail: context.driver?.email,
        companyId: context.company?.id,
      });

      const success = await emailService.sendTemplateEmail(
        templateType,
        context,
        options
      );

      if (success) {
        console.log(`Template email sent successfully: ${templateType}`);
        res.json({
          success: true,
          message: "Email sent successfully",
          data: {
            templateType,
            sentTo: options?.to || context.driver?.email,
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        console.error(`Failed to send template email: ${templateType}`);
        res.status(500).json({
          success: false,
          message: "Failed to send email",
          error: "EMAIL_SEND_FAILED",
        });
      }
    } catch (error) {
      console.error("Error in POST /api/v1/emails/send-template:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Send custom email
  app.post("/api/v1/emails/send-custom", async (req, res) => {
    try {
      const { to, from, subject, html, text } = req.body;

      // Validate required fields
      if (!to || !subject || !html) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: to, subject, and html",
          error: "MISSING_REQUIRED_FIELDS",
        });
      }

      console.log("Sending custom email", {
        to,
        from: from || "default",
        subject,
        hasHtml: !!html,
        hasText: !!text,
      });

      const success = await emailService.sendCustomEmail({
        to,
        from: from || undefined,
        subject,
        html,
        text,
      });

      if (success) {
        console.log("Custom email sent successfully");
        res.json({
          success: true,
          message: "Email sent successfully",
          data: {
            sentTo: to,
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        console.error("Failed to send custom email");
        res.status(500).json({
          success: false,
          message: "Failed to send email",
          error: "EMAIL_SEND_FAILED",
        });
      }
    } catch (error) {
      console.error("Error in POST /api/v1/emails/send-custom:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Send application submission emails (combines template + admin notification)
  app.post("/api/v1/emails/application-submitted", async (req, res) => {
    try {
      const { application, company, adminEmail } = req.body;

      if (!application || !company) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: application and company",
          error: "MISSING_REQUIRED_FIELDS",
        });
      }

      console.log("Sending application submission emails", {
        applicationId: application.id,
        driverEmail: application.email,
        adminEmail: adminEmail || "not provided",
      });

      const emailContext = { driver: application, company };

      // Send confirmation email to applicant
      const applicantEmailSuccess = await emailService.sendTemplateEmail(
        EmailTemplateType.APPLICATION_SUBMITTED,
        emailContext
      );

      let adminEmailSuccess = true;
      let adminEmailData = null;

      // Send notification to admin if email provided
      if (adminEmail) {
        adminEmailData = {
          to: adminEmail,
          from: process.env.DEFAULT_FROM_EMAIL || "noreply@trucking.mba",
          subject: `New Driver Application - ${application.first_name} ${application.last_name}`,
          html: `
            <h2>New Driver Application Received</h2>
            <p><strong>Applicant:</strong> ${application.first_name} ${
            application.last_name
          }</p>
            <p><strong>Position:</strong> ${
              application.position_applied_for
            }</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Application ID:</strong> ${application.id}</p>
            <p><strong>Submitted:</strong> ${new Date(
              application.submitted_at
            ).toLocaleString()}</p>
            <p>Please review the application in the admin portal.</p>
          `,
        };

        adminEmailSuccess = await emailService.sendCustomEmail(adminEmailData);
      }

      if (applicantEmailSuccess && adminEmailSuccess) {
        console.log("Application submission emails sent successfully");
        res.json({
          success: true,
          message: "Application submission emails sent successfully",
          data: {
            applicantEmailSent: applicantEmailSuccess,
            adminEmailSent: adminEmailSuccess,
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        console.error("Failed to send some application submission emails", {
          applicantEmailSuccess,
          adminEmailSuccess,
        });
        res.status(500).json({
          success: false,
          message: "Failed to send some emails",
          error: "PARTIAL_EMAIL_FAILURE",
          data: {
            applicantEmailSent: applicantEmailSuccess,
            adminEmailSent: adminEmailSuccess,
          },
        });
      }
    } catch (error) {
      console.error("Error in POST /api/v1/emails/application-submitted:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Send background check emails
  app.post("/api/v1/emails/background-check", async (req, res) => {
    try {
      const { action, application, company } = req.body;

      if (!action || !application || !company) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: action, application, and company",
          error: "MISSING_REQUIRED_FIELDS",
        });
      }

      const validActions = ["initiated", "completed"];
      if (!validActions.includes(action)) {
        return res.status(400).json({
          success: false,
          message: "Invalid action. Must be 'initiated' or 'completed'",
          error: "INVALID_ACTION",
          validActions,
        });
      }

      console.log(`Sending background check ${action} email`, {
        applicationId: application.id,
        driverEmail: application.email,
      });

      const emailContext = { driver: application, company };
      const templateType =
        action === "initiated"
          ? EmailTemplateType.BACKGROUND_CHECK_INITIATED
          : EmailTemplateType.BACKGROUND_CHECK_COMPLETED;

      const success = await emailService.sendTemplateEmail(
        templateType,
        emailContext
      );

      if (success) {
        console.log(`Background check ${action} email sent successfully`);
        res.json({
          success: true,
          message: `Background check ${action} email sent successfully`,
          data: {
            action,
            sentTo: application.email,
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        console.error(`Failed to send background check ${action} email`);
        res.status(500).json({
          success: false,
          message: "Failed to send email",
          error: "EMAIL_SEND_FAILED",
        });
      }
    } catch (error) {
      console.error("Error in POST /api/v1/emails/background-check:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get available email templates
  app.get("/api/v1/emails/templates", async (req, res) => {
    try {
      const templates = Object.values(EmailTemplateType).map(
        (type: EmailTemplateType) => ({
          type,
          name: type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          category: getTemplateCategory(type),
        })
      );

      res.json({
        success: true,
        message: "Email templates retrieved successfully",
        data: {
          templates,
          total: templates.length,
        },
      });
    } catch (error) {
      console.error("Error in GET /api/v1/emails/templates:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        message: "Failed to retrieve email templates",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Helper function to categorize templates
  function getTemplateCategory(templateType: EmailTemplateType): string {
    if (templateType.includes("APPLICATION_")) return "Application";
    if (templateType.includes("BACKGROUND_CHECK_")) return "Background Check";
    if (templateType.includes("DOCUMENT_")) return "Document";
    if (
      templateType.includes("WELCOME") ||
      templateType.includes("REMINDER") ||
      templateType.includes("EXPIRATION")
    )
      return "Notification";
    if (templateType.includes("SYSTEM") || templateType.includes("ERROR"))
      return "System";
    return "Other";
  }

  const httpServer = createServer(app);
  return httpServer;
}
