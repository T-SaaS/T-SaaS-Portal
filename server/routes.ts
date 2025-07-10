import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { insertDriverApplicationSchema } from "@shared/schema";
import express, { json } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { db } from "./db";
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
  app.post("/api/driver-applications", async (req, res) => {
    try {
      // console.log("Received driver application request:", {
      //   body: req.body,
      //   contentType: req.get("Content-Type"),
      //   timestamp: new Date().toISOString(),
      // });

      const validatedData = insertDriverApplicationSchema.parse(req.body);
      // console.log("Validation successful:", {
      //   companyId: validatedData.company_id,
      //   applicantName: `${validatedData.first_name} ${validatedData.last_name}`,
      //   email: validatedData.email,
      // });

      const application = await db.createDriverApplication(validatedData);
      console.log("Application created successfully:", {
        id: application.id,
        companyId: application.company_id,
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
  app.get("/api/driver-applications", async (req, res) => {
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
  app.get("/api/driver-applications/:id", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
