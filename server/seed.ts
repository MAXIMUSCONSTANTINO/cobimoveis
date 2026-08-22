import { db } from "./db";
import { assets } from "../drizzle/schema";
import { sql } from "drizzle-orm";

export async function seedInitialAssets() {
  if (!db) return;
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(assets);
    const count = Number(existing[0]?.count || 0);
    if (count > 0) return; // já populado

    const sampleAssets = [
      {
        code: "ATIV-0001",
        title: "Gleba Estratégica Pé na Areia - Litoral Norte",
        category: "Glebas",
        type: "Terreno / Gleba",
        location: "Costa dos Corais, Litoral Norte",
        municipality: "Maragogi",
        state: "AL",
        area: "45.000 m²",
        value: "R$ 18.500.000",
        numericValue: 18500000,
        description: "Gleba exclusiva com 180 metros de frente para o mar, ideal para resort boutique ou condomínio fechado de altíssimo padrão. Due diligence jurídica e ambiental pré-analisada.",
        characteristics: ["Frente Mar", "Escritura Pública", "Zoneamento Turístico-Residencial", "Topografia Plana"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ],
        videos: [],
        documents: ["Matriz Atualizada", "Certidões Negativas Federais/Estaduais", "Estudo de Viabilidade Preliminar"],
        status: "PUBLICADO" as const,
        availability: "Disponível",
        purpose: "Desenvolvimento / Investimento",
        investmentProfile: "Incorporação Imobiliária & Patrimonial",
        origin: "Captação Exclusiva Cobquattu",
        responsible: "José Constantino",
        dueDiligenceStatus: "Concluída" as const,
        dueDiligenceDetails: {
          matricula: "Matrícula nº 14.281 - RI Maragogi",
          cadeiaDominial: "Regularizada há mais de 30 anos sem litígios",
          fiscal: "CND Federal, Estadual e Municipal em dia",
          zoneamento: "Zona de Expansão Urbana e Turística (ZU-2)",
          riscos: "Nenhum passivo ambiental identificado na faixa de marinha"
        },
        isPubliclyVisible: 1,
      },
      {
        code: "ATIV-0002",
        title: "Fazenda Histórica & Ativo Produtivo - Chapada Diamantina",
        category: "Terrenos",
        type: "Área Rural / Ativo Estratégico",
        location: "Região da Chapada Diamantina",
        municipality: "Lençóis",
        state: "BA",
        area: "1.200 Hectares",
        value: "R$ 32.000.000",
        numericValue: 32000000,
        description: "Propriedade emblemática com recursos hídricos abundantes, nascentes perenes, infraestrutura de sede histórica restaurada e potencial para ecoturismo ou agricultura sustentável.",
        characteristics: ["Nascentes Próprias", "Sede Restaurada", "Acesso Asfaltado", "Documentação Georreferenciada"],
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
        ],
        videos: [],
        documents: ["CAR Aprovado", "Georreferenciamento INCRA", "Matrícula Matriz"],
        status: "PUBLICADO" as const,
        availability: "Disponível",
        purpose: "Reserva de Valor / Agroestratégico",
        investmentProfile: "Preservação Patrimonial & Renda",
        origin: "Parceiro Credenciado",
        responsible: "José Constantino",
        dueDiligenceStatus: "Concluída" as const,
        dueDiligenceDetails: {
          matricula: "Matrícula Consolidada - Cartório de Registro de Imóveis",
          cadeiaDominial: "Títulos perfeitos desde a concessão original",
          fiscal: "Imposto Territorial Rural (ITR) quitado",
          zoneamento: "Uso Sustentável e Reserva Legal averbada",
          riscos: "Nenhum gravame ou penhora"
        },
        isPubliclyVisible: 1,
      },
      {
        code: "ATIV-0003",
        title: "Penthouse Exclusiva em Condomínio Fechado - Alphaville",
        category: "Segunda Residência",
        type: "Imóvel de Alto Padrão",
        location: "Alphaville Residencial",
        municipality: "Barueri",
        state: "SP",
        area: "680 m² Privativos",
        value: "R$ 14.800.000",
        numericValue: 14800000,
        description: "Residência suspensa com projeto arquitetônico contemporâneo assinado, acabamento em mármores importados, automação completa e vista panorâmica definitiva para a reserva.",
        characteristics: ["Projeto Assinado", "Automação Integrada", "4 Vagas de Garagem", "Piscina Privativa Aquecida"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
        ],
        videos: [],
        documents: ["Escritura Definitiva", "CND Condominial", "Habite-se Municipal"],
        status: "PUBLICADO" as const,
        availability: "Disponível",
        purpose: "Moradia & Patrimônio",
        investmentProfile: "Alto Padrão / Liquidez Qualificada",
        origin: "Captação Direta",
        responsible: "José Constantino",
        dueDiligenceStatus: "Concluída" as const,
        dueDiligenceDetails: {
          matricula: "Matrícula Individualizada nº 89.210",
          cadeiaDominial: "Proprietário único desde a entrega da torre",
          fiscal: "IPTU e taxas condominiais totalmente regularizadas",
          zoneamento: "Residencial Exclusivo",
          riscos: "Sem ônus reais"
        },
        isPubliclyVisible: 1,
      },
      {
        code: "ATIV-0004",
        title: "Área para Incorporação Comercial - Eixo Faria Lima",
        category: "Ativos Comerciais",
        type: "Terreno Comercial",
        location: "Itaim Bibi / Faria Lima",
        municipality: "São Paulo",
        state: "SP",
        area: "2.400 m²",
        value: "R$ 45.000.000",
        numericValue: 45000000,
        description: "Terreno unificado em localização prime para desenvolvimento de edifício corporativo AAA ou torre mista residencial de luxo. Coeficiente de aproveitamento máximo permitido.",
        characteristics: ["Frente Ampla para Avenida", "Potencial Construtivo Elevado", "Demolição Concluída", "Estudo de Viabilidade Disponível"],
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
        ],
        videos: [],
        documents: ["Certidão de Diretrizes de Traçado", "Certidão de Uso do Solo", "Matrículas Unificadas"],
        status: "PUBLICADO" as const,
        availability: "Disponível",
        purpose: "Desenvolvimento Corporativo",
        investmentProfile: "Incorporação de Grande Porte",
        origin: "Parceiro Credenciado",
        responsible: "José Constantino",
        dueDiligenceStatus: "Concluída" as const,
        dueDiligenceDetails: {
          matricula: "Matrículas 45.102, 45.103 e 45.104 unificadas",
          cadeiaDominial: "Histórico limpo com due diligence realizada por escritório parceiro",
          fiscal: "Certidões negativas plenas",
          zoneamento: "ZM / ZEUP",
          riscos: "Baixo risco regulatório"
        },
        isPubliclyVisible: 1,
      }
    ];

    for (const item of sampleAssets) {
      await db.insert(assets).values(item);
    }
    console.log("[Seed] Sample assets seeded successfully.");
  } catch (err) {
    console.error("[Seed] Error seeding assets:", err);
  }
}
