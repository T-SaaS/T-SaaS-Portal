import { driverApplications, type DriverApplication, type InsertDriverApplication } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createDriverApplication(application: InsertDriverApplication): Promise<DriverApplication>;
  getDriverApplication(id: number): Promise<DriverApplication | undefined>;
  getAllDriverApplications(): Promise<DriverApplication[]>;
}

export class DatabaseStorage implements IStorage {
  async createDriverApplication(insertApplication: InsertDriverApplication): Promise<DriverApplication> {
    const [application] = await db
      .insert(driverApplications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getDriverApplication(id: number): Promise<DriverApplication | undefined> {
    const [application] = await db
      .select()
      .from(driverApplications)
      .where(eq(driverApplications.id, id));
    return application || undefined;
  }

  async getAllDriverApplications(): Promise<DriverApplication[]> {
    return await db.select().from(driverApplications);
  }
}

export const storage = new DatabaseStorage();
