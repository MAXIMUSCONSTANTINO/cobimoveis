import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { db } from "./db";
import { assets, clients, demands, assetSubmissions, assetInterests, partnerApplications } from "../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Módulo de Ativos / Imóveis
  assetsApi: router({
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          municipality: z.string().optional(),
          purpose: z.string().optional(),
          status: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        let conditions = [eq(assets.isPubliclyVisible, 1)];
        if (input?.category && input.category !== "Todos") {
          conditions.push(eq(assets.category, input.category));
        }
        if (input?.municipality && input.municipality !== "Todos") {
          conditions.push(eq(assets.municipality, input.municipality));
        }
        if (input?.purpose && input.purpose !== "Todos") {
          conditions.push(eq(assets.purpose, input.purpose));
        }
        if (input?.status) {
          conditions.push(eq(assets.status, input.status as any));
        }

        const list = await db
          .select()
          .from(assets)
          .where(and(...conditions))
          .orderBy(desc(assets.createdAt));
        return list;
      }),

    listAdmin: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Acesso restrito a administradores");
      }
      return await db.select().from(assets).orderBy(desc(assets.createdAt));
    }),

    getByCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const [asset] = await db
          .select()
          .from(assets)
          .where(eq(assets.code, input.code));
        return asset || null;
      }),

    create: protectedProcedure
      .input(
        z.object({
          code: z.string(),
          title: z.string(),
          category: z.string(),
          type: z.string(),
          location: z.string(),
          municipality: z.string(),
          state: z.string(),
          area: z.string(),
          value: z.string(),
          numericValue: z.number().optional(),
          description: z.string(),
          characteristics: z.any(),
          images: z.any(),
          videos: z.any().optional(),
          documents: z.any().optional(),
          status: z.string(),
          availability: z.string().optional(),
          purpose: z.string(),
          investmentProfile: z.string().optional(),
          origin: z.string().optional(),
          responsible: z.string().optional(),
          dueDiligenceStatus: z.string().optional(),
          dueDiligenceDetails: z.any().optional(),
          isPubliclyVisible: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Apenas administradores podem cadastrar ativos.");
        }
        await db.insert(assets).values({
          code: input.code,
          title: input.title,
          category: input.category,
          type: input.type,
          location: input.location,
          municipality: input.municipality,
          state: input.state,
          area: input.area,
          value: input.value,
          numericValue: input.numericValue || 0,
          description: input.description,
          characteristics: input.characteristics || [],
          images: input.images || [],
          videos: input.videos || [],
          documents: input.documents || [],
          status: input.status as any,
          availability: input.availability || "Disponível",
          purpose: input.purpose,
          investmentProfile: input.investmentProfile || "",
          origin: input.origin || "Captação Direta",
          responsible: input.responsible || "José Constantino",
          dueDiligenceStatus: (input.dueDiligenceStatus as any) || "Nao iniciada",
          dueDiligenceDetails: input.dueDiligenceDetails || {},
          isPubliclyVisible: input.isPubliclyVisible ?? 1,
        });
        return { success: true };
      }),

    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), status: z.string(), dueDiligenceStatus: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Acesso restrito.");
        const updateData: any = { status: input.status };
        if (input.dueDiligenceStatus) updateData.dueDiligenceStatus = input.dueDiligenceStatus;
        await db.update(assets).set(updateData).where(eq(assets.id, input.id));
        return { success: true };
      }),
  }),

  // Módulo de Demandas (Procurar um Ativo)
  demandsApi: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string(),
          phone: z.string(),
          whatsapp: z.string().optional(),
          category: z.string(),
          location: z.string(),
          purpose: z.string(),
          areaRange: z.string().optional(),
          investmentRange: z.string().optional(),
          observations: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        let [client] = await db.select().from(clients).where(eq(clients.email, input.email));
        let clientId: number;
        if (!client) {
          const [res] = await db.insert(clients).values({
            name: input.name,
            email: input.email,
            phone: input.phone,
            whatsapp: input.whatsapp || "",
            profileType: "Investidor / Comprador",
            purpose: input.purpose,
            desiredLocation: input.location,
            investmentRange: input.investmentRange || "",
            origin: "Demanda Específica",
            responsible: "José Constantino",
          });
          clientId = res.insertId;
        } else {
          clientId = client.id;
        }

        const countRes = await db.select({ count: sql<number>`count(*)` }).from(demands);
        const nextId = (Number(countRes[0]?.count) || 0) + 1;
        const code = `DEMANDA-${String(nextId).padStart(4, "0")}`;

        await db.insert(demands).values({
          code,
          clientId,
          category: input.category,
          location: input.location,
          purpose: input.purpose,
          areaRange: input.areaRange || "",
          investmentRange: input.investmentRange || "",
          observations: input.observations || "",
          status: "Ativa",
        });

        return { success: true, code };
      }),

    listAdmin: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Acesso restrito.");
      return await db
        .select({
          demand: demands,
          client: clients,
        })
        .from(demands)
        .leftJoin(clients, eq(demands.clientId, clients.id))
        .orderBy(desc(demands.createdAt));
    }),
  }),

  // Módulo de Captação de Imóveis (Tenho um Imóvel)
  submissionsApi: router({
    create: publicProcedure
      .input(
        z.object({
          ownerName: z.string(),
          phone: z.string(),
          whatsapp: z.string().optional(),
          email: z.string(),
          assetType: z.string(),
          location: z.string(),
          area: z.string().optional(),
          targetValue: z.string().optional(),
          description: z.string(),
          documentationAvailable: z.string().optional(),
          photos: z.any().optional(),
          observations: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(assetSubmissions).values({
          ownerName: input.ownerName,
          phone: input.phone,
          whatsapp: input.whatsapp || "",
          email: input.email,
          assetType: input.assetType,
          location: input.location,
          area: input.area || "",
          targetValue: input.targetValue || "",
          description: input.description,
          documentationAvailable: input.documentationAvailable || "",
          photos: input.photos || [],
          observations: input.observations || "",
          status: "Novo Envio",
        });
        return { success: true };
      }),

    listAdmin: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Acesso restrito.");
      return await db.select().from(assetSubmissions).orderBy(desc(assetSubmissions.createdAt));
    }),
  }),

  // Módulo de Interesse em Ativos específicos
  interestsApi: router({
    create: publicProcedure
      .input(
        z.object({
          assetId: z.number(),
          clientName: z.string(),
          clientEmail: z.string(),
          clientPhone: z.string(),
          interestType: z.string().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(assetInterests).values({
          assetId: input.assetId,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
          interestType: input.interestType || "Investimento Direto",
          message: input.message || "",
          status: "Novo Contato",
          responsible: "José Constantino",
        });
        return { success: true };
      }),

    listAdmin: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Acesso restrito.");
      return await db
        .select({
          interest: assetInterests,
          asset: assets,
        })
        .from(assetInterests)
        .leftJoin(assets, eq(assetInterests.assetId, assets.id))
        .orderBy(desc(assetInterests.createdAt));
    }),
  }),

  // Módulo de Parceiros / Corretores Credenciados
  partnersApi: router({
    submitPartner: publicProcedure
      .input(
        z.object({
          fullName: z.string(),
          email: z.string(),
          phone: z.string(),
          creciOrCnpj: z.string(),
          region: z.string(),
          specialty: z.string(),
          experience: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(partnerApplications).values({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          creciOrCnpj: input.creciOrCnpj,
          region: input.region,
          specialty: input.specialty,
          experience: input.experience,
          status: "Em Análise",
        });
        return { success: true };
      }),

    listAdmin: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Acesso restrito.");
      return await db.select().from(partnerApplications).orderBy(desc(partnerApplications.createdAt));
    }),
  }),
});

export type AppRouter = typeof appRouter;
