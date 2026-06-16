export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Restaurant = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  opening_hours: string | null;
  delivery_areas: string | null;
  payment_methods: string | null;
  tax_note: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type MenuCategory = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  spice_level: string | null;
  serving_size: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_recommended: boolean;
  created_at: string;
  updated_at: string;
};

export type Deal = {
  id: string;
  restaurant_id: string;
  title: string;
  description: string | null;
  price: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  terms: string | null;
  created_at: string;
  updated_at: string;
};

export type FAQ = {
  id: string;
  restaurant_id: string;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type KnowledgeDocument = {
  id: string;
  restaurant_id: string;
  title: string;
  source_type: "manual" | "menu" | "faq" | "deal" | "profile" | "pdf" | "txt" | "docx" | "website";
  content: string | null;
  file_url: string | null;
  metadata: Json;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
};

export type KnowledgeChunk = {
  id: string;
  document_id: string;
  restaurant_id: string;
  content: string;
  chunk_index: number;
  token_count: number | null;
  metadata: Json;
  similarity?: number;
  created_at: string;
};

export type ChatSession = {
  id: string;
  restaurant_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  status: "active" | "closed";
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  restaurant_id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sources: Json;
  created_at: string;
};

export type Lead = {
  id: string;
  restaurant_id: string;
  session_id: string | null;
  type: "order" | "reservation" | "general";
  customer_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  message: string | null;
  details: Json;
  status: "new" | "contacted" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
};

export type ChatbotSettings = {
  id: string;
  restaurant_id: string;
  bot_name: string;
  welcome_message: string;
  fallback_message: string;
  primary_color: string;
  is_active: boolean;
  collect_leads: boolean;
  created_at: string;
  updated_at: string;
};

type SupabaseTable<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row & Record<string, unknown>;
  Insert: Insert & Record<string, unknown>;
  Update: Update & Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      restaurants: SupabaseTable<Restaurant>;
      menu_categories: SupabaseTable<MenuCategory>;
      menu_items: SupabaseTable<MenuItem>;
      deals: SupabaseTable<Deal>;
      faqs: SupabaseTable<FAQ>;
      knowledge_documents: SupabaseTable<KnowledgeDocument>;
      knowledge_chunks: SupabaseTable<KnowledgeChunk, Partial<KnowledgeChunk> & { embedding?: number[] }>;
      chat_sessions: SupabaseTable<ChatSession>;
      chat_messages: SupabaseTable<ChatMessage>;
      leads: SupabaseTable<Lead>;
      chatbot_settings: SupabaseTable<ChatbotSettings>;
    };
    Views: Record<string, never>;
    Functions: {
      match_knowledge_chunks: {
        Args: { query_embedding: number[]; match_restaurant_id: string; match_count?: number; similarity_threshold?: number };
        Returns: KnowledgeChunk[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
