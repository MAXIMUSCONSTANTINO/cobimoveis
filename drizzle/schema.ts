import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, jsonb } from "drizzle-orm/pg-core";

// Enums do Postgres
export const roleEnum = pgEnum("role", ["user", "admin", "partner"]);
export const statusEnum = pgEnum("status", [
  "CAPTADO",
  "EM_PRE_ANALISE",
  "DOCUMENTACAO_SOLICITADA",
  "EM_DUE_DILIGENCE",
  "APROVADO",
  "PUBLICADO",
  "EM_NEGOCIACAO",
  "RESERVADO",
  "VENDIDO",
  "REPROVADO",
  "ARQUIVADO",
  "SUSPENSO"
]);
export const dueDiligenceStatusEnum = pgEnum("due_diligence_status", [
  "Nao iniciada",
  "Em andamento",
  "Documentação pendente",
  "Concluída",
  "Com ressalvas",
  "Não aprovado"
]);

// Tabela de Usuários
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Ativos Imobiliários
export const assets = pgTable("assets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  title: text("title").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  location: text("location").notNull(),
  municipality: varchar("municipality", { length: 128 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  area: varchar("area", { length: 64 }).notNull(),
  value: varchar("value", { length: 64 }).notNull(),
  numericValue: integer("numeric_value"),
  description: text("description").notNull(),
  characteristics: jsonb("characteristics"),
  images: jsonb("images"),
  videos: jsonb("videos"),
  documents: jsonb("documents"),
  status: statusEnum("status").default("CAPTADO").notNull(),
  availability: varchar("availability", { length: 64 }).default("Disponível"),
  purpose: varchar("purpose", { length: 64 }).notNull(),
  investmentProfile: varchar("investment_profile", { length: 128 }),
  origin: varchar("origin", { length: 64 }).default("Captação Direta"),
  responsible: varchar("responsible", { length: 128 }).default("José Constantino"),
  partnerId: integer("partner_id"),
  dueDiligenceStatus: dueDiligenceStatusEnum("due_diligence_status").default("Nao iniciada").notNull(),
  dueDiligenceDetails: jsonb("due_diligence_details"),
  isPubliclyVisible: integer("is_publicly_visible").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

// Tabela de Clientes e Perfis
export const clients = pgTable("clients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 32 }),
  profileType: varchar("profile_type", { length: 64 }).notNull(),
  purpose: varchar("purpose", { length: 64 }),
  desiredLocation: text("desired_location"),
  investmentRange: varchar("investment_range", { length: 64 }),
  preferences: text("preferences"),
  origin: varchar("origin", { length: 64 }).default("Site Público"),
  responsible: varchar("responsible", { length: 128 }).default("José Constantino"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// Tabela de Demandas
export const demands = pgTable("demands", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  clientId: integer("client_id").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  location: text("location").notNull(),
  purpose: varchar("purpose", { length: 64 }).notNull(),
  areaRange: varchar("area_range", { length: 64 }),
  investmentRange: varchar("investment_range", { length: 64 }),
  observations: text("observations"),
  status: varchar("status", { length: 64 }).default("Ativa").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Demand = typeof demands.$inferSelect;
export type InsertDemand = typeof demands.$inferInsert;

// Tabela de Captação de Imóveis
export const assetSubmissions = pgTable("asset_submissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ownerName: varchar("owner_name", { length: 128 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 32 }),
  email: varchar("email", { length: 320 }).notNull(),
  assetType: varchar("asset_type", { length: 64 }).notNull(),
  location: text("location").notNull(),
  area: varchar("area", { length: 64 }),
  targetValue: varchar("target_value", { length: 64 }),
  description: text("description").notNull(),
  documentationAvailable: text("documentation_available"),
  photos: jsonb("photos"),
  observations: text("observations"),
  status: varchar("status", { length: 64 }).default("Novo Envio").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetSubmission = typeof assetSubmissions.$inferSelect;
export type InsertAssetSubmission = typeof assetSubmissions.$inferInsert;

// Tabela de Interesses em Ativos
export const assetInterests = pgTable("asset_interests", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("client_id"),
  assetId: integer("asset_id").notNull(),
  clientName: varchar("client_name", { length: 128 }).notNull(),
  clientEmail: varchar("client_email", { length: 320 }).notNull(),
  clientPhone: varchar("client_phone", { length: 32 }).notNull(),
  interestType: varchar("interest_type", { length: 64 }).default("Investimento Direto").notNull(),
  message: text("message"),
  status: varchar("status", { length: 64 }).default("Novo Contato").notNull(),
  responsible: varchar("responsible", { length: 128 }).default("José Constantino"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetInterest = typeof assetInterests.$inferSelect;
export type InsertAssetInterest = typeof assetInterests.$inferInsert;

// Tabela de Credenciamento de Parceiros
export const partnerApplications = pgTable("partner_applications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar("full_name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  creciOrCnpj: varchar("creci_or_cnpj", { length: 64 }).notNull(),
  region: varchar("region", { length: 128 }).notNull(),
  specialty: varchar("specialty", { length: 128 }).notNull(),
  experience: text("experience").notNull(),
  status: varchar("status", { length: 64 }).default("Em Análise").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type InsertPartnerApplication = typeof partnerApplications.$inferInsert;
