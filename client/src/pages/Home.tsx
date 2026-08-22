import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, ShieldCheck, Search, Compass, FileCheck, Users, Lock, ChevronRight, 
  MapPin, DollarSign, ArrowRight, CheckCircle2, ShieldAlert, FileText, Upload, Briefcase, 
  ExternalLink, Menu, X, Check, Eye, UserCheck, Layers
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedMunicipality, setSelectedMunicipality] = useState("Todos");
  const [selectedPurpose, setSelectedPurpose] = useState("Todos");

  // Modals state
  const [activeAssetModal, setActiveAssetModal] = useState<any | null>(null);
  const [demandModalOpen, setDemandModalOpen] = useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [interestModalOpen, setInterestModalOpen] = useState(false);

  // Form states
  const [demandForm, setDemandForm] = useState({
    name: "", email: "", phone: "", whatsapp: "", category: "Glebas", location: "", purpose: "Desenvolvimento", areaRange: "10.000 - 30.000 m²", investmentRange: "R$ 5M - R$ 20M", observations: ""
  });

  const [submissionForm, setSubmissionForm] = useState({
    ownerName: "", phone: "", whatsapp: "", email: "", assetType: "Terreno / Gleba", location: "", area: "", targetValue: "", description: "", documentationAvailable: "Matrícula regularizada", observations: ""
  });

  const [partnerForm, setPartnerForm] = useState({
    fullName: "", email: "", phone: "", creciOrCnpj: "", region: "", specialty: "Imóveis de Alto Padrão / Glebas", experience: ""
  });

  const [interestForm, setInterestForm] = useState({
    clientName: "", clientEmail: "", clientPhone: "", interestType: "Investimento Direto", message: ""
  });

  // Queries
  const { data: assetsList, refetch: refetchAssets } = trpc.assetsApi.list.useQuery({
    category: selectedCategory,
    municipality: selectedMunicipality,
    purpose: selectedPurpose
  });

  const { data: adminAssets } = trpc.assetsApi.listAdmin.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: adminDemands } = trpc.demandsApi.listAdmin.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: adminSubmissions } = trpc.submissionsApi.listAdmin.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: adminInterests } = trpc.interestsApi.listAdmin.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: adminPartners } = trpc.partnersApi.listAdmin.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });

  // Mutations
  const demandMutation = trpc.demandsApi.create.useMutation({
    onSuccess: (res) => {
      toast.success(`Demanda registrada com sucesso! Código: ${res.code}`);
      setDemandModalOpen(false);
      setDemandForm({ name: "", email: "", phone: "", whatsapp: "", category: "Glebas", location: "", purpose: "Desenvolvimento", areaRange: "", investmentRange: "", observations: "" });
    },
    onError: (err) => toast.error(`Erro ao registrar demanda: ${err.message}`)
  });

  const submissionMutation = trpc.submissionsApi.create.useMutation({
    onSuccess: () => {
      toast.success("Oportunidade de captação enviada com sucesso! Nossa curadoria analisará as informações.");
      setSubmissionModalOpen(false);
      setSubmissionForm({ ownerName: "", phone: "", whatsapp: "", email: "", assetType: "Terreno / Gleba", location: "", area: "", targetValue: "", description: "", documentationAvailable: "", observations: "" });
    },
    onError: (err) => toast.error(`Erro ao enviar: ${err.message}`)
  });

  const partnerMutation = trpc.partnersApi.submitPartner.useMutation({
    onSuccess: () => {
      toast.success("Solicitação de credenciamento enviada com sucesso! Entraremos em contato.");
      setPartnerModalOpen(false);
      setPartnerForm({ fullName: "", email: "", phone: "", creciOrCnpj: "", region: "", specialty: "", experience: "" });
    },
    onError: (err) => toast.error(`Erro ao enviar: ${err.message}`)
  });

  const interestMutation = trpc.interestsApi.create.useMutation({
    onSuccess: () => {
      toast.success("Interesse registrado com sucesso! Nossa equipe entrará em contato para atendimento reservado.");
      setInterestModalOpen(false);
      setInterestForm({ clientName: "", clientEmail: "", clientPhone: "", interestType: "Investimento Direto", message: "" });
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="sticky top-0 z-50 bg-[#0A0D14]/90 backdrop-blur-md border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-amber-500/20">
              JC
            </div>
            <div>
              <a href="https://cobquattu.com.br" target="_blank" rel="noreferrer" className="text-xs tracking-widest text-amber-400/80 uppercase hover:text-amber-300 transition-colors">
                Ecossistema Cobquattu
              </a>
              <h1 className="text-sm font-semibold tracking-wide text-white">
                José Constantino <span className="text-amber-400 font-light">| Consultoria Imobiliária & Ativos Estratégicos</span>
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#portfolio" className="hover:text-amber-400 transition-colors">Portfólio</a>
            <a href="#ciclo" className="hover:text-amber-400 transition-colors">Curadoria & Due Diligence</a>
            <a href="#portas" className="hover:text-amber-400 transition-colors">Portas de Entrada</a>
            <a href="#contato" className="hover:text-amber-400 transition-colors">Contato Privado</a>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'admin' && (
                  <Button onClick={() => setAdminModalOpen(true)} size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                    Painel Gestão
                  </Button>
                )}
                <span className="text-xs text-slate-400 hidden lg:inline">{user?.name || user?.email}</span>
                <Button variant="outline" size="sm" onClick={() => logout()} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Sair
                </Button>
              </div>
            ) : (
              <Button onClick={() => startLogin()} size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Acesso Restrito / Admin</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-[#0A0D14] via-[#111622] to-[#0A0D14]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs tracking-widest uppercase mb-8">
            <ShieldCheck className="w-4 h-4" />
            <span>Inteligência de Mercado & Alocação de Capital</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-white mb-6 leading-tight">
            Curadoria técnica, segurança jurídica e discrição para ativos imobiliários de alto padrão.
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Plataforma especializada na gestão de grandes glebas, terrenos, segunda residência e oportunidades estratégicas para investidores exigentes.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#portfolio" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg shadow-xl shadow-amber-500/10 transition-all flex items-center space-x-2">
              <span>Explorar Portfólio</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Button onClick={() => setDemandModalOpen(true)} variant="outline" className="px-8 py-4 border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800 rounded-lg text-base">
              Procurar um Ativo
            </Button>
            <Button onClick={() => setSubmissionModalOpen(true)} variant="outline" className="px-8 py-4 border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800 rounded-lg text-base">
              Tenho um Imóvel
            </Button>
          </div>
        </div>
      </section>

      {/* QUATRO PORTAS DE ENTRADA */}
      <section id="portas" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-xs uppercase tracking-widest text-amber-400 mb-3 font-semibold">Arquitetura de Relacionamento</h3>
          <h2 className="text-3xl font-serif text-white">Quatro Portas de Entrada para Operações Estratégicas</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Porta 1 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">1. Comprar / Investir</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Explore nosso portfólio curado de glebas, terrenos e ativos de altíssimo padrão com due diligence prévia.
              </p>
            </div>
            <a href="#portfolio" className="text-amber-400 text-sm font-medium flex items-center space-x-2 hover:text-amber-300">
              <span>Explorar Portfólio</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Porta 2 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">2. Procurar um Ativo</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Para quem possui uma necessidade específica de aquisição ou desenvolvimento e busca inteligência de captação sob medida.
              </p>
            </div>
            <button onClick={() => setDemandModalOpen(true)} className="text-amber-400 text-sm font-medium flex items-center space-x-2 hover:text-amber-300">
              <span>Encontrar um Ativo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Porta 3 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">3. Tenho um Imóvel</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Para proprietários de ativos relevantes que buscam distribuição qualificada, discrição e curadoria profissional.
              </p>
            </div>
            <button onClick={() => setSubmissionModalOpen(true)} className="text-amber-400 text-sm font-medium flex items-center space-x-2 hover:text-amber-300">
              <span>Tenho um Imóvel</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Porta 4 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">4. Sou Corretor / Parceiro</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Credenciamento para profissionais e parceiros alinhados aos mais altos padrões de ética e due diligence imobiliária.
              </p>
            </div>
            <button onClick={() => setPartnerModalOpen(true)} className="text-amber-400 text-sm font-medium flex items-center space-x-2 hover:text-amber-300">
              <span>Quero ser Parceiro</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* PORTFÓLIO PÚBLICO */}
      <section id="portfolio" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-amber-400 mb-2 font-semibold">Portfólio Curado</h3>
            <h2 className="text-3xl font-serif text-white">Ativos Selecionados & Oportunidades Estratégicas</h2>
          </div>
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {["Todos", "Glebas", "Terrenos", "Segunda Residência", "Ativos Comerciais"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === cat 
                    ? "bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20" 
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Ativos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {assetsList && assetsList.length > 0 ? (
            assetsList.map((asset) => (
              <div key={asset.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={Array.isArray(asset.images) && asset.images[0] ? asset.images[0] : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"} 
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-amber-500 text-black font-semibold px-3 py-1">{asset.category}</Badge>
                      <Badge className="bg-slate-950/80 text-amber-400 border border-amber-500/30 px-3 py-1">{asset.code}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-slate-400 text-xs mb-2 space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{asset.municipality}, {asset.state} — {asset.location}</span>
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                      {asset.title}
                    </h4>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-light">
                      {asset.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800 mb-6 text-sm">
                      <div>
                        <span className="text-slate-500 block text-xs">Área</span>
                        <span className="text-white font-medium">{asset.area}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Valor de Referência</span>
                        <span className="text-amber-400 font-semibold">{asset.value}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Due Diligence: {asset.dueDiligenceStatus}</span>
                  </div>
                  <Button onClick={() => setActiveAssetModal(asset)} size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                    Ver Detalhes & Dossier
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-20 text-slate-500">
              Nenhum ativo encontrado com os filtros selecionados.
            </div>
          )}
        </div>
      </section>

      {/* CICLO E DUE DILIGENCE */}
      <section id="ciclo" className="py-20 px-6 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-xs uppercase tracking-widest text-amber-400 mb-2 font-semibold">Rastreabilidade & Rigor Técnico</h3>
            <h2 className="text-3xl font-serif text-white">O Ciclo de Curadoria & Due Diligence</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mt-3">
              Nunca declaramos que um imóvel está 100% regularizado sem comprovação documental exaustiva. Cada ativo passa por análises rigorosas.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl">
              <span className="text-amber-400 font-bold text-lg">01</span>
              <h4 className="text-white font-semibold mt-2 mb-2">Captação & Pré-Análise</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recepção do ativo, verificação preliminar de titularidade e adequação aos padrões Cobquattu.
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl">
              <span className="text-amber-400 font-bold text-lg">02</span>
              <h4 className="text-white font-semibold mt-2 mb-2">Due Diligence Jurídica</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Análise de matrícula, cadeia dominial, certidões forenses, fiscais e ambientais.
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl">
              <span className="text-amber-400 font-bold text-lg">03</span>
              <h4 className="text-white font-semibold mt-2 mb-2">Curadoria & Publicação</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elaboração de dossiê técnico, valoração fundamentada e disponibilização em canal restrito ou público.
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl">
              <span className="text-amber-400 font-bold text-lg">04</span>
              <h4 className="text-white font-semibold mt-2 mb-2">Matching & Negociação</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conexão qualificada com investidores cadastrados, conduzindo transações com segurança e sigilo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer id="contato" className="py-16 px-6 border-t border-slate-800 bg-[#07090F] text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded bg-amber-500 text-black font-bold flex items-center justify-center text-sm">JC</div>
              <span className="text-white font-medium">José Constantino</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Consultoria Imobiliária & Ativos Estratégicos. Curadoria técnica, inteligência de mercado e segurança jurídica.
            </p>
            <a href="https://cobquattu.com.br" target="_blank" rel="noreferrer" className="text-xs text-amber-400 hover:underline flex items-center space-x-1">
              <span>cobquattu.com.br</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Portas de Entrada</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#portfolio" className="hover:text-amber-400">Comprar / Investir</a></li>
              <li><button onClick={() => setDemandModalOpen(true)} className="hover:text-amber-400 text-left">Procurar um Ativo</button></li>
              <li><button onClick={() => setSubmissionModalOpen(true)} className="hover:text-amber-400 text-left">Tenho um Imóvel</button></li>
              <li><button onClick={() => setPartnerModalOpen(true)} className="hover:text-amber-400 text-left">Sou Corretor / Parceiro</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Categorias de Ativos</h5>
            <ul className="space-y-2 text-xs">
              <li><span>Glebas e Terrenos</span></li>
              <li><span>Segunda Residência</span></li>
              <li><span>Imóveis Pé na Areia</span></li>
              <li><span>Ativos Comerciais & Incorporação</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Atendimento Reservado</h5>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Reuniões presenciais ou virtuais mediante agendamento prévio com a diretoria.
            </p>
            <span className="text-amber-400 text-xs font-semibold">contato@cobquattu.com.br</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
          <p>© 2026 José Constantino & Ecossistema Cobquattu. Todos os direitos reservados.</p>
          <p className="mt-4 md:mt-0">Confidencialidade, Inteligência e Preservação Patrimonial.</p>
        </div>
      </footer>

      {/* MODAL DE DETALHES DO ATIVO & DUE DILIGENCE */}
      {activeAssetModal && (
        <Dialog open={!!activeAssetModal} onOpenChange={() => setActiveAssetModal(null)}>
          <DialogContent className="max-w-4xl bg-[#0F131F] border border-slate-800 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500 text-black font-semibold">{activeAssetModal.code}</Badge>
                <Badge variant="outline" className="text-amber-400 border-amber-500/30">{activeAssetModal.category}</Badge>
              </div>
              <DialogTitle className="text-2xl font-serif text-white">{activeAssetModal.title}</DialogTitle>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeAssetModal.municipality}, {activeAssetModal.state} — {activeAssetModal.location}</span>
              </p>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Galeria */}
              <div className="grid grid-cols-2 gap-4">
                {Array.isArray(activeAssetModal.images) && activeAssetModal.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="Ativo" className="w-full h-48 object-cover rounded-lg border border-slate-800" />
                ))}
              </div>

              {/* Informações Principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-sm">
                <div>
                  <span className="text-slate-500 text-xs block">Área Total</span>
                  <span className="font-semibold text-white">{activeAssetModal.area}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Valor de Referência</span>
                  <span className="font-semibold text-amber-400">{activeAssetModal.value}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Finalidade</span>
                  <span className="font-semibold text-white">{activeAssetModal.purpose}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Perfil de Investimento</span>
                  <span className="font-semibold text-white">{activeAssetModal.investmentProfile || "Patrimonial"}</span>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <h5 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wider">Descrição Estratégica</h5>
                <p className="text-slate-300 text-sm leading-relaxed font-light">{activeAssetModal.description}</p>
              </div>

              {/* Características */}
              <div>
                <h5 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wider">Características</h5>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(activeAssetModal.characteristics) && activeAssetModal.characteristics.map((c: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Módulo Due Diligence */}
              <div className="p-5 bg-slate-950 border border-amber-500/30 rounded-xl">
                <div className="flex items-center space-x-2 text-amber-400 mb-3">
                  <ShieldCheck className="w-5 h-5" />
                  <h5 className="font-semibold text-sm uppercase tracking-wider">Due Diligence & Status Documental</h5>
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <p><strong className="text-white">Status Geral:</strong> {activeAssetModal.dueDiligenceStatus}</p>
                  {activeAssetModal.dueDiligenceDetails && typeof activeAssetModal.dueDiligenceDetails === 'object' && (
                    <div className="mt-3 space-y-1.5 border-t border-slate-800 pt-3">
                      <p><strong>Matrícula:</strong> {(activeAssetModal.dueDiligenceDetails as any).matricula || "Em verificação"}</p>
                      <p><strong>Cadeia Dominial:</strong> {(activeAssetModal.dueDiligenceDetails as any).cadeiaDominial || "Em análise"}</p>
                      <p><strong>Situação Fiscal:</strong> {(activeAssetModal.dueDiligenceDetails as any).fiscal || "Regular"}</p>
                      <p><strong>Zoneamento:</strong> {(activeAssetModal.dueDiligenceDetails as any).zoneamento || "Conforme diretrizes"}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Interesse */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <Button onClick={() => setInterestModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  Tenho Interesse neste Ativo / Atendimento Privado
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL PROCURAR UM ATIVO (DEMANDA) */}
      <Dialog open={demandModalOpen} onOpenChange={setDemandModalOpen}>
        <DialogContent className="max-w-xl bg-[#0F131F] border border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-white">Procurar um Ativo (Demanda Específica)</DialogTitle>
            <p className="text-xs text-slate-400">Informe os parâmetros da sua necessidade de aquisição ou desenvolvimento.</p>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); demandMutation.mutate(demandForm); }} className="space-y-4 mt-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nome Completo</label>
                <Input required value={demandForm.name} onChange={e => setDemandForm({...demandForm, name: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">E-mail</label>
                <Input required type="email" value={demandForm.email} onChange={e => setDemandForm({...demandForm, email: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Telefone</label>
                <Input required value={demandForm.phone} onChange={e => setDemandForm({...demandForm, phone: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">WhatsApp</label>
                <Input value={demandForm.whatsapp} onChange={e => setDemandForm({...demandForm, whatsapp: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Categoria</label>
                <Input value={demandForm.category} onChange={e => setDemandForm({...demandForm, category: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Localização Desejada</label>
                <Input required placeholder="Ex: Litoral do Ceará" value={demandForm.location} onChange={e => setDemandForm({...demandForm, location: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Área Desejada</label>
                <Input placeholder="Ex: 10.000 a 30.000 m²" value={demandForm.areaRange} onChange={e => setDemandForm({...demandForm, areaRange: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Faixa de Investimento</label>
                <Input placeholder="Ex: R$ 5.000.000" value={demandForm.investmentRange} onChange={e => setDemandForm({...demandForm, investmentRange: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Observações & Especificações</label>
              <Textarea placeholder="Descreva os detalhes da oportunidade procurada..." value={demandForm.observations} onChange={e => setDemandForm({...demandForm, observations: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDemandModalOpen(false)} className="border-slate-800 text-slate-300">Cancelar</Button>
              <Button type="submit" disabled={demandMutation.isPending} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                {demandMutation.isPending ? "Registrando..." : "Registrar Demanda"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL TENHO UM IMÓVEL (CAPTAÇÃO) */}
      <Dialog open={submissionModalOpen} onOpenChange={setSubmissionModalOpen}>
        <DialogContent className="max-w-xl bg-[#0F131F] border border-slate-800 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-white">Tenho um Imóvel (Oportunidade de Captação)</DialogTitle>
            <p className="text-xs text-slate-400">Cadastre seu ativo para análise confidencial pela curadoria Cobquattu.</p>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); submissionMutation.mutate(submissionForm); }} className="space-y-4 mt-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nome do Proprietário</label>
                <Input required value={submissionForm.ownerName} onChange={e => setSubmissionForm({...submissionForm, ownerName: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">E-mail</label>
                <Input required type="email" value={submissionForm.email} onChange={e => setSubmissionForm({...submissionForm, email: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Telefone</label>
                <Input required value={submissionForm.phone} onChange={e => setSubmissionForm({...submissionForm, phone: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">WhatsApp</label>
                <Input value={submissionForm.whatsapp} onChange={e => setSubmissionForm({...submissionForm, whatsapp: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Tipo de Ativo</label>
                <Input value={submissionForm.assetType} onChange={e => setSubmissionForm({...submissionForm, assetType: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Localização / Município</label>
                <Input required placeholder="Ex: Trancoso, BA" value={submissionForm.location} onChange={e => setSubmissionForm({...submissionForm, location: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Área</label>
                <Input placeholder="Ex: 5.000 m²" value={submissionForm.area} onChange={e => setSubmissionForm({...submissionForm, area: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Valor Pretendido</label>
                <Input placeholder="Ex: R$ 10.000.000" value={submissionForm.targetValue} onChange={e => setSubmissionForm({...submissionForm, targetValue: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Descrição do Imóvel</label>
              <Textarea required placeholder="Detalhes, diferenciais e vocação do ativo..." value={submissionForm.description} onChange={e => setSubmissionForm({...submissionForm, description: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Documentação Disponível</label>
              <Input placeholder="Ex: Matrícula atualizada, escritura, CAR" value={submissionForm.documentationAvailable} onChange={e => setSubmissionForm({...submissionForm, documentationAvailable: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setSubmissionModalOpen(false)} className="border-slate-800 text-slate-300">Cancelar</Button>
              <Button type="submit" disabled={submissionMutation.isPending} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                {submissionMutation.isPending ? "Enviando..." : "Enviar para Curadoria"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL SOU CORRETOR / PARCEIRO */}
      <Dialog open={partnerModalOpen} onOpenChange={setPartnerModalOpen}>
        <DialogContent className="max-w-xl bg-[#0F131F] border border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-white">Credenciamento de Parceiros & Corretores</DialogTitle>
            <p className="text-xs text-slate-400">Solicite seu credenciamento para atuar junto ao ecossistema Cobquattu.</p>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); partnerMutation.mutate(partnerForm); }} className="space-y-4 mt-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nome Completo</label>
                <Input required value={partnerForm.fullName} onChange={e => setPartnerForm({...partnerForm, fullName: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">E-mail</label>
                <Input required type="email" value={partnerForm.email} onChange={e => setPartnerForm({...partnerForm, email: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Telefone / WhatsApp</label>
                <Input required value={partnerForm.phone} onChange={e => setPartnerForm({...partnerForm, phone: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">CRECI ou CNPJ</label>
                <Input required value={partnerForm.creciOrCnpj} onChange={e => setPartnerForm({...partnerForm, creciOrCnpj: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Região de Atuação</label>
                <Input required placeholder="Ex: Sul da Bahia" value={partnerForm.region} onChange={e => setPartnerForm({...partnerForm, region: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Especialidade</label>
                <Input value={partnerForm.specialty} onChange={e => setPartnerForm({...partnerForm, specialty: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Experiência & Histórico Profissional</label>
              <Textarea required placeholder="Descreva brevemente sua atuação no mercado imobiliário..." value={partnerForm.experience} onChange={e => setPartnerForm({...partnerForm, experience: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setPartnerModalOpen(false)} className="border-slate-800 text-slate-300">Cancelar</Button>
              <Button type="submit" disabled={partnerMutation.isPending} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                {partnerMutation.isPending ? "Enviando..." : "Solicitar Credenciamento"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL INTERESSE EM ATIVO */}
      <Dialog open={interestModalOpen} onOpenChange={setInterestModalOpen}>
        <DialogContent className="max-w-md bg-[#0F131F] border border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-white">Solicitar Atendimento Privado</DialogTitle>
            <p className="text-xs text-slate-400">Atendimento reservado com a diretoria sobre o ativo {activeAssetModal?.code}.</p>
          </DialogHeader>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (!activeAssetModal) return;
            interestMutation.mutate({
              assetId: activeAssetModal.id,
              ...interestForm
            });
          }} className="space-y-4 mt-2 text-sm">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nome Completo</label>
              <Input required value={interestForm.clientName} onChange={e => setInterestForm({...interestForm, clientName: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">E-mail</label>
              <Input required type="email" value={interestForm.clientEmail} onChange={e => setInterestForm({...interestForm, clientEmail: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Telefone / WhatsApp</label>
              <Input required value={interestForm.clientPhone} onChange={e => setInterestForm({...interestForm, clientPhone: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Mensagem / Observação</label>
              <Textarea placeholder="Gostaria de agendar reunião ou receber o dossiê completo..." value={interestForm.message} onChange={e => setInterestForm({...interestForm, message: e.target.value})} className="bg-slate-900 border-slate-800 text-white" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setInterestModalOpen(false)} className="border-slate-800 text-slate-300">Cancelar</Button>
              <Button type="submit" disabled={interestMutation.isPending} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                {interestMutation.isPending ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* PAINEL DE GESTÃO DO ADMIN */}
      {adminModalOpen && (
        <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
          <DialogContent className="max-w-5xl bg-[#0A0D14] border border-amber-500/30 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-amber-400">Painel de Gestão e Operação Central</DialogTitle>
              <p className="text-xs text-slate-400">José Constantino | Administração de Ativos, Demandas, Captação e Relacionamento.</p>
            </DialogHeader>

            <Tabs defaultValue="ativos" className="mt-6">
              <TabsList className="bg-slate-900 border border-slate-800">
                <TabsTrigger value="ativos">Ativos ({adminAssets?.length || 0})</TabsTrigger>
                <TabsTrigger value="interesses">Interesses ({adminInterests?.length || 0})</TabsTrigger>
                <TabsTrigger value="demandas">Demandas ({adminDemands?.length || 0})</TabsTrigger>
                <TabsTrigger value="captacoes">Captações ({adminSubmissions?.length || 0})</TabsTrigger>
                <TabsTrigger value="parceiros">Parceiros ({adminPartners?.length || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="ativos" className="space-y-4 mt-4">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Ativos Cadastrados no Sistema</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">Código</th>
                        <th className="pb-3">Título</th>
                        <th className="pb-3">Categoria</th>
                        <th className="pb-3">Valor</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Due Diligence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {adminAssets?.map(a => (
                        <tr key={a.id} className="hover:bg-slate-900/50">
                          <td className="py-3 font-semibold text-amber-400">{a.code}</td>
                          <td className="py-3">{a.title}</td>
                          <td className="py-3">{a.category}</td>
                          <td className="py-3 text-amber-300">{a.value}</td>
                          <td className="py-3"><Badge className="bg-slate-800 text-slate-300">{a.status}</Badge></td>
                          <td className="py-3"><Badge className="bg-emerald-950 text-emerald-400 border border-emerald-900">{a.dueDiligenceStatus}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="interesses" className="space-y-4 mt-4">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Captação de Interesses em Ativos</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">Cliente</th>
                        <th className="pb-3">Contato</th>
                        <th className="pb-3">Ativo</th>
                        <th className="pb-3">Mensagem</th>
                        <th className="pb-3">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {adminInterests?.map(i => (
                        <tr key={i.interest.id} className="hover:bg-slate-900/50">
                          <td className="py-3 font-semibold text-white">{i.interest.clientName}</td>
                          <td className="py-3 text-slate-300">{i.interest.clientEmail} / {i.interest.clientPhone}</td>
                          <td className="py-3 text-amber-400">{i.asset?.code} - {i.asset?.title}</td>
                          <td className="py-3 text-slate-400 max-w-xs truncate">{i.interest.message}</td>
                          <td className="py-3 text-slate-500">{new Date(i.interest.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="demandas" className="space-y-4 mt-4">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Demandas Registradas (Procurar um Ativo)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">Código</th>
                        <th className="pb-3">Cliente</th>
                        <th className="pb-3">Localização</th>
                        <th className="pb-3">Categoria</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {adminDemands?.map(d => (
                        <tr key={d.demand.id} className="hover:bg-slate-900/50">
                          <td className="py-3 font-semibold text-amber-400">{d.demand.code}</td>
                          <td className="py-3 text-white">{d.client?.name} ({d.client?.email})</td>
                          <td className="py-3">{d.demand.location}</td>
                          <td className="py-3">{d.demand.category}</td>
                          <td className="py-3"><Badge className="bg-amber-500/20 text-amber-400">{d.demand.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="captacoes" className="space-y-4 mt-4">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Oportunidades de Captação (Tenho um Imóvel)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">Proprietário</th>
                        <th className="pb-3">Contato</th>
                        <th className="pb-3">Tipo / Local</th>
                        <th className="pb-3">Valor Pretendido</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {adminSubmissions?.map(s => (
                        <tr key={s.id} className="hover:bg-slate-900/50">
                          <td className="py-3 font-semibold text-white">{s.ownerName}</td>
                          <td className="py-3 text-slate-300">{s.email} / {s.phone}</td>
                          <td className="py-3">{s.assetType} em {s.location}</td>
                          <td className="py-3 text-amber-400">{s.targetValue}</td>
                          <td className="py-3"><Badge className="bg-slate-800 text-slate-300">{s.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="parceiros" className="space-y-4 mt-4">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Candidaturas de Parceiros & Corretores</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">Nome</th>
                        <th className="pb-3">CRECI / CNPJ</th>
                        <th className="pb-3">Região</th>
                        <th className="pb-3">Especialidade</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {adminPartners?.map(p => (
                        <tr key={p.id} className="hover:bg-slate-900/50">
                          <td className="py-3 font-semibold text-white">{p.fullName} ({p.email})</td>
                          <td className="py-3 text-amber-400">{p.creciOrCnpj}</td>
                          <td className="py-3">{p.region}</td>
                          <td className="py-3">{p.specialty}</td>
                          <td className="py-3"><Badge className="bg-amber-500/20 text-amber-400">{p.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
