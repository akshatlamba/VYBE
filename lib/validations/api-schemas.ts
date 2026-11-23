import { z } from "zod";

// Standard API response shape
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  academic_year: z.string().min(1, "Academic year is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  budget_max: z.number().min(0, "Budget must be 0 or greater"),
  availability: z.string().min(1, "Availability is required"),
  preferred_format: z.enum(["online", "onsite", "hybrid", "any"]),
  skills: z.array(
    z.object({
      name: z.string().min(1),
      level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    })
  ),
  interests: z.array(z.string()),
  primary_goal: z.enum(["internship", "startup", "research", "hackathon"]),
  sharing_prefs: z
    .object({
      public_passport: z.boolean(),
      show_email: z.boolean(),
      share_aggregates: z.boolean(),
    })
    .optional(),
});

export const PulseMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  signal_id: z.string().optional(),
  persona_id: z.string().default("beginner"),
});

export const ApplicationCreateSchema = z.object({
  opportunity_id: z.string().min(1, "Opportunity ID is required"),
  stage: z.enum(["saved", "preparing", "applied", "attended", "done", "withdrawn"]).default("saved"),
  notes: z.string().optional(),
});

export const ApplicationUpdateSchema = z.object({
  id: z.string().min(1),
  stage: z.enum(["saved", "preparing", "applied", "attended", "done", "withdrawn"]),
  notes: z.string().optional(),
});

export const TaskCreateSchema = z.object({
  application_id: z.string().min(1, "Application ID is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  due_date: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const OutcomeCreateSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  participation: z.string().min(1, "Participation role is required"),
  reflection: z.string().min(5, "Reflection must be at least 5 characters"),
  skills_gained: z.array(z.string()).min(1, "At least one skill is required"),
  opportunity_id: z.string().optional(),
  evidence_url: z.string().url("Evidence URL must be a valid link").optional().or(z.literal("")),
});
