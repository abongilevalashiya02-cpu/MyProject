import { z } from 'zod';

export const horoApplicationSchema = z.object({
  // Step 1: Contact Information
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  workEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().optional(),
  
  // Step 2: Organizational Context
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title is required.",
  }),
  teamSize: z.string().min(1, {
    message: "Please select a team size.",
  }),
  
  // Step 3: Experience Requirements
  objectives: z.array(z.string()).min(1, {
    message: "Please select at least one objective.",
  }),
  experienceDetails: z.string().optional(),
  locations: z.string().optional(),
  budgetRange: z.string().optional(),
  source: z.string().optional(),
});

export type HoroApplicationData = z.infer<typeof horoApplicationSchema>;