import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "partner"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Ativos Imobiliários (Imóveis / Glebas / Loteamentos / etc)
export const assets = mysqlTable("assets", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(), // ex: ATIV-0001
  title: text("title").notNull(),
  category: varchar("category", { length: 64 }).notNull(), // Terrenos, Glebas, Loteamentos, Segunda Residência, Pé na Areia, Alto Padrão, Comerciais, Incorporação, Estratégicas
  type: varchar("type", { length: 64 }).notNull(),
  location: text("location").notNull(),
  municipality: varchar("municipality", { length: 128 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  area: varchar("area", { length: 64 }).notNull(), // ex: "15.000 m²"
  value: varchar("value", { length: 64 }).notNull(), // ex: "R$ 4.500.000"
  numericValue: int("numeric_value"), // para filtros
  description: text("description").notNull(),
  characteristics: json("characteristics"), // array de strings
  images: json("images"), // array de URLs
  videos: json("videos"), // array de URLs
  documents: json("documents"), // lista de nomes de docs
  status: mysqlEnum("status", [
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
  ]).default("CAPTADO").notNull(),
  availability: varchar("availability", { length: 64 }).default("Disponível"),
  purpose: varchar("purpose", { length: 64 }).notNull(), // Investimento, Desenvolvimento, Uso Próprio
  investmentProfile: varchar("investment_profile", { length: 128 }),
  origin: varchar("origin", { length: 64 }).default("Captação Direta"),
  responsible: varchar("responsible", { length: 128 }).default("José Constantino"),
  partnerId: int("partner_id"),
  dueDiligenceStatus: mysqlEnum("due_diligence_status", [
    "Nao iniciada",
    "Em andamento",
    "Documentação pendente",
    "Concluída",
    "Com ressalvas",
    "Não aprovado"
  ]).default("Nao iniciada").notNull(),
  dueDiligenceDetails: json("due_diligence_details"), // matrícula, certidões, zoneamento, riscos
  isPubliclyVisible: int("is_publicly_visible").default(1).notNull(), // 1 = sim, 0 = não
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

// Tabela de Clientes e Perfis
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 32 }),
  profileType: varchar("profile_type", { length: 64 }).notNull(), // Investidor, Comprador, Segunda residência, Incorporador, Empresarial, Outro
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

// Tabela de Demandas (Busca de Ativo Específico)
export const demands = mysqlTable("demands", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(), // ex: DEMANDA-0001
  clientId: int("client_id").notNull(),
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

// Tabela de Captação de Imóveis (Tenho um Imóvel)
export const assetSubmissions = mysqlTable("asset_submissions", {
  id: int("id").autoincrement().primaryKey(),
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
  photos: json("photos"),
  observations: text("observations"),
  status: varchar("status", { length: 64 }).default("Novo Envio").notNull(), // Novo Envio, Em Análise, Convertido em Ativo, Arquivado
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetSubmission = typeof assetSubmissions.$inferSelect;
export type InsertAssetSubmission = typeof assetSubmissions.$inferInsert;

// Tabela de Interesses em Ativos (Tenho Interesse / Solicitar Atendimento)
export const assetInterests = mysqlTable("asset_interests", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id"),
  assetId: int("asset_id").notNull(),
  clientName: varchar("client_name", { length: 128 }).notNull(),
  clientEmail: varchar("client_email", { length: 320 }).notNull(),
  clientPhone: varchar("client_phone", { length: 32 }).notNull(),
  interestType: varchar("interest_type", { length: 64 }).default("Investimento Direto").notNull(),
  message: text("message"),
  status: varchar("status", { length: 64 }).default("Novo Contato").notNull(), // Novo Contato, Em Atendimento, Reunião Agendada, Negociação, Concluído
  responsible: varchar("responsible", { length: 128 }).default("José Constantino"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetInterest = typeof assetInterests.$inferSelect;
export type InsertAssetInterest = typeof assetInterests.$inferInsert;

// Tabela de Solicitações de Credenciamento de Parceiros (Corretores / Parceiros)
export const partnerApplications = mysqlTable("partner_applications", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("full_name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  creciOrCnpj: varchar("creci_or_cnpj", { length: 64 }).notNull(),
  region: varchar("region", { length: 128 }).notNull(),
  specialty: varchar("specialty", { length: 128 }).notNull(),
  experience: text("experience").notNull(),
  status: varchar("status", { length: 64 }).default("Em Análise").notNull(), // Em Análise, Aprovado, Reprovado
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type InsertPartnerApplication = typeof partnerApplications.$inferInsert;
