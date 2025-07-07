import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDriverApplicationSchema } from "@shared/schema";
import { backgroundCheckService } from "./backgroundCheckService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit driver application
  app.post("/api/driver-applications", async (req, res) => {
    try {
      const validatedData = insertDriverApplicationSchema.parse(req.body);
      const application = await storage.createDriverApplication(validatedData);
      
      // Initiate background check process
      if (application.consentToBackgroundCheck === 1) {
        backgroundCheckService.initiateBackgroundCheck(application.id);
      }
      
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get all driver applications
  app.get("/api/driver-applications", async (req, res) => {
    try {
      const applications = await storage.getAllDriverApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get driver application by ID
  app.get("/api/driver-applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getDriverApplication(id);
      
      if (!application) {
        res.status(404).json({ 
          message: "Application not found" 
        });
        return;
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Get background check status
  app.get("/api/driver-applications/:id/background-check", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const status = await backgroundCheckService.getBackgroundCheckStatus(id);
      
      if (!status) {
        res.status(404).json({ 
          message: "Application not found" 
        });
        return;
      }
      
      res.json(status);
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
