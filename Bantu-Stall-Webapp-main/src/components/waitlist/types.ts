
import { z } from 'zod';

// Form schema
export const waitlistFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  country: z.string().min(2, { message: 'Please enter a valid country' }),
});

// Form data type
export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;
