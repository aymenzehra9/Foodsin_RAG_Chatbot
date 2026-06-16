import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  website: z.string().url().optional().or(z.literal("")).nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  opening_hours: z.string().optional().nullable(),
  delivery_areas: z.string().optional().nullable(),
  payment_methods: z.string().optional().nullable(),
  tax_note: z.string().optional().nullable(),
  logo_url: z.string().url().optional().or(z.literal("")).nullable(),
  cover_image_url: z.string().url().optional().or(z.literal("")).nullable()
});

export const menuItemSchema = z.object({
  restaurant_id: uuidSchema,
  category_id: uuidSchema.optional().nullable(),
  name: z.string().min(1, "Menu item name is required"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive().optional().nullable(),
  image_url: z.string().url().optional().or(z.literal("")).nullable(),
  spice_level: z.string().optional().nullable(),
  serving_size: z.string().optional().nullable(),
  is_available: z.boolean().default(true),
  is_popular: z.boolean().default(false),
  is_recommended: z.boolean().default(false)
});

export const categorySchema = z.object({
  restaurant_id: uuidSchema,
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true)
});

export const dealSchema = z.object({
  restaurant_id: uuidSchema,
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  terms: z.string().optional().nullable()
});

export const faqSchema = z.object({
  restaurant_id: uuidSchema,
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().optional().nullable(),
  is_active: z.boolean().default(true)
});

export const knowledgeDocumentSchema = z.object({
  restaurant_id: uuidSchema,
  title: z.string().min(1),
  source_type: z.enum(["manual", "menu", "faq", "deal", "profile", "pdf", "txt", "docx", "website"]).default("manual"),
  content: z.string().min(1),
  file_url: z.string().url().optional().or(z.literal("")).nullable(),
  metadata: z.record(z.unknown()).default({})
});

export const chatSchema = z.object({
  restaurantId: uuidSchema,
  sessionId: uuidSchema.optional().nullable(),
  message: z.string().min(1, "Chat message is required").max(2000)
});

export const leadSchema = z.object({
  restaurant_id: uuidSchema,
  session_id: uuidSchema.optional().nullable(),
  type: z.enum(["order", "reservation", "general"]),
  customer_name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  address: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  details: z.record(z.unknown()).default({}),
  status: z.enum(["new", "contacted", "confirmed", "cancelled", "completed"]).default("new")
});
