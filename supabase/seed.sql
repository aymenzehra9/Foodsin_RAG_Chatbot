insert into restaurants (id, name, description, phone, whatsapp, website, address, city, opening_hours, payment_methods)
values (
  '00000000-0000-0000-0000-000000000000',
  'Foods Inn',
  'Family restaurant serving BBQ, Chinese, burgers, sandwiches, handi, karahi, Italian, steaks, seafood, desserts, mocktails, and beverages.',
  '0213 8899998',
  '+92 330-0122230',
  'https://foodsinn.co',
  'Plot # 21-22, Allama I. I. Qazi Chowk, Block A, Sindhi Muslim Society / SMCHS, Karachi',
  'Karachi',
  'Please contact the restaurant to confirm current opening hours.',
  'Cash and other payment methods should be confirmed with restaurant staff.'
) on conflict (id) do nothing;

insert into chatbot_settings (restaurant_id) values ('00000000-0000-0000-0000-000000000000') on conflict (restaurant_id) do nothing;

insert into menu_categories (restaurant_id, name, sort_order) values
('00000000-0000-0000-0000-000000000000', 'Appetizers', 1),
('00000000-0000-0000-0000-000000000000', 'Burgers', 2),
('00000000-0000-0000-0000-000000000000', 'Sandwiches', 3),
('00000000-0000-0000-0000-000000000000', 'Chinese', 4),
('00000000-0000-0000-0000-000000000000', 'BBQ', 5),
('00000000-0000-0000-0000-000000000000', 'Handi', 6),
('00000000-0000-0000-0000-000000000000', 'Karahi', 7),
('00000000-0000-0000-0000-000000000000', 'Italian', 8),
('00000000-0000-0000-0000-000000000000', 'Steaks', 9),
('00000000-0000-0000-0000-000000000000', 'Seafood', 10),
('00000000-0000-0000-0000-000000000000', 'Desserts', 11),
('00000000-0000-0000-0000-000000000000', 'Beverages', 12),
('00000000-0000-0000-0000-000000000000', 'Mocktails & Shakes', 13),
('00000000-0000-0000-0000-000000000000', 'Family Deals', 14);

insert into knowledge_documents (restaurant_id, title, source_type, content, status)
values (
  '00000000-0000-0000-0000-000000000000',
  'Foods Inn demo knowledge',
  'manual',
  'Foods Inn is a family restaurant in Karachi, Pakistan. Phone: 0213 8899998. WhatsApp: +92 330-0122230. Address: Plot # 21-22, Allama I. I. Qazi Chowk, Block A, Sindhi Muslim Society / SMCHS, Karachi. Main categories include BBQ, Chinese, Burgers, Sandwiches, Handi, Karahi, Italian, Steaks, Seafood, Desserts, Mocktails, and Beverages. Sample menu items include Chicken Chowmein, Singaporean Rice, Chicken Manchurian, Egg Fried Rice, Dynamite Chicken, Spicy Wings, Chicken Tikka, Malai Boti, Seekh Kabab, Chicken Handi, Chicken Cheese Handi, Chicken Karahi, Crispy Chicken Burger, Beef Burger, Club Sandwich, Alfredo Pasta, Chicken Steak, Fried Fish, Prawn Tempura, Brownie, Soft Drink, and Mint Margarita. Prices in demo data must be verified by the restaurant admin. All prices are exclusive of sales tax and may change without prior notice.',
  'pending'
);

insert into knowledge_documents (restaurant_id, title, source_type, content, status)
values (
  '00000000-0000-0000-0000-000000000000',
  'AI model information',
  'manual',
  'When a customer asks which LLM, AI model, chatbot model, or language model is used by this chatbot, answer that the chatbot uses Google''s Gemini AI models. The chat response model is configured by the GEMINI_CHAT_MODEL environment variable. If no custom model is configured, the application defaults to gemini-2.0-flash. The RAG embedding model is configured by the GEMINI_EMBEDDING_MODEL environment variable. If no custom embedding model is configured, the application defaults to gemini-embedding-001. Suggested short answer: This chatbot uses Google''s Gemini AI models. The default chat model is gemini-2.0-flash, and RAG embeddings use gemini-embedding-001 unless the restaurant admin has configured different Gemini models.',
  'pending'
);
