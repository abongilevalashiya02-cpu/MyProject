
import { z } from 'zod';

// Form validation schema
export const formSchema = z.object({
  // Page 1 (no data entry)
  
  // Page 2
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  organization: z.string().optional(),
  country: z.string().min(2, {
    message: "Please select your country.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  
  // Page 3
  destination: z.string().min(2, {
    message: "Please select a destination.",
  }),
  experienceType: z.string().min(2, {
    message: "Please select an experience type.",
  }),
  groupSize: z.string().min(1, {
    message: "Please select a group size.",
  }),
  duration: z.string().min(1, {
    message: "Please select a duration.",
  }),
  budget: z.string().min(1, {
    message: "Please select a budget range.",
  }),
  
  // Page 4
  goal1: z.string().min(2, {
    message: "Please select your first goal.",
  }),
  goal2: z.string().min(2, {
    message: "Please select your second goal.",
  }),
  localFacilitators: z.enum(["yes", "no", "maybe"], {
    required_error: "Please select an option.",
  }),
});

export type FormValues = z.infer<typeof formSchema>;
