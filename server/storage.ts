import { driverApplications, type DriverApplication, type InsertDriverApplication } from "@shared/schema";

export interface IStorage {
  createDriverApplication(application: InsertDriverApplication): Promise<DriverApplication>;
  getDriverApplication(id: number): Promise<DriverApplication | undefined>;
  getAllDriverApplications(): Promise<DriverApplication[]>;
}

export class MemStorage implements IStorage {
  private applications: Map<number, DriverApplication>;
  private currentId: number;

  constructor() {
    this.applications = new Map();
    this.currentId = 1;
  }

  async createDriverApplication(insertApplication: InsertDriverApplication): Promise<DriverApplication> {
    const id = this.currentId++;
    const application: DriverApplication = {
      ...insertApplication,
      id,
      submittedAt: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }

  async getDriverApplication(id: number): Promise<DriverApplication | undefined> {
    return this.applications.get(id);
  }

  async getAllDriverApplications(): Promise<DriverApplication[]> {
    return Array.from(this.applications.values());
  }
}

export const storage = new MemStorage();
