import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaChevronRight,
  FaLocationDot,
  FaMagnifyingGlass,
  FaSatellite,
  FaTableList,
} from "react-icons/fa6";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LeiturasFilters } from "./FiltersPanel";
import TableLeituras from "./TableLeituras";
import Map from "./Map";
import { jwtDecode } from "jwt-decode";

export interface Leitura {
  id: string;
  estacao_id: number;
  temperatura: number;
  umidade: number;
  pressao_atmosferica: number;
  velocidade_vento: number;
  precipitacao: number;
  data_leitura: string;
  estacao?: {
    id: number;
    nome: string;
  };
}

export interface Convite {
  id?: string;
  token?: string;
  email?: string;
  nome?: string;
  status?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface EstacaoResumo {
  id: number;
  nome: string;
  status: "ATIVA" | "INATIVA" | "MANUTENCAO" | string;
  endereco: string;
  localizacao: {
    type?: string;
    coordinates: [number, number];
  };
  usuario_proprietario_id: number;
  proprietario?: {
    id: number;
    nome: string;
    email: string;
  };
  equipe?: Array<{
    id: number;
    nome: string;
    email: string;
    usuarios_estacoes?: {
      papel?: string;
    };
  }>;
  leituras?: Leitura[];
}

interface QueryState {
  page: number;
  limit: number;
  sort: string;
}

type InsightTab = "logs" | "convites";
type MetricTab = "temperatura" | "umidade" | "pressao_atmosferica" | "velocidade_vento" | "precipitacao";

const defaultFilters: LeiturasFilters = {
  criadaDepois: "",
  criadaAntes: "",
  temperatura_min: "",
  temperatura_max: "",
  umidade_min: "",
  umidade_max: "",
  pressao_atmosferica_min: "",
  pressao_atmosferica_max: "",
  velocidade_vento_min: "",
  velocidade_vento_max: "",
  precipitacao_min: "",
  precipitacao_max: "",
};

const statusMap: Record<string, string> = {
  ATIVA: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INATIVA: "bg-amber-100 text-amber-700 border-amber-200",
  MANUTENCAO: "bg-sky-100 text-sky-700 border-sky-200",
};

const metricConfig: Record<MetricTab, { label: string; unit: string; color: string; area: string }> = {
  temperatura: {
    label: "Temperatura",
    unit: "°C",
    color: "#ef4444",
    area: "rgba(239,68,68,0.18)",
  },
  umidade: {
    label: "Umidade",
    unit: "%",
    color: "#0ea5e9",
    area: "rgba(14,165,233,0.18)",
  },
  pressao_atmosferica: {
    label: "Pressão",
    unit: "hPa",
    color: "#f59e0b",
    area: "rgba(245,158,11,0.18)",
  },
  velocidade_vento: {
    label: "Vento",
    unit: "km/h",
    color: "#8b5cf6",
    area: "rgba(139,92,246,0.18)",
  },
  precipitacao: {
    label: "Precipitação",
    unit: "mm",
    color: "#14b8a6",
    area: "rgba(20,184,166,0.18)",
  },
};

function formatDate(value?: string) {
  if (!value) return "--";
  return new Date(value).toLocaleString("pt-BR");
}

function formatNumber(value?: number, digits = 1) {
  if (value === undefined || value === null || Number.isNaN(value)) return "--";
  return value.toFixed(digits);
}

function buildQuery(filters: LeiturasFilters, queryState: QueryState) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
  params.set("page", String(queryState.page));
  params.set("limit", String(queryState.limit));
  params.set("sort", queryState.sort);
  return params.toString();
}

function buildOverlaySeries(base: Leitura[], selectedStations: EstacaoResumo[], metric: MetricTab) {
  const grouped: Record<string, any> = {};
  base.forEach((item) => {
    grouped[item.data_leitura] = {
      ...(grouped[item.data_leitura] || {}),
      timestamp: item.data_leitura,
      [`estacao_${item.estacao_id}`]: item[metric],
    };
  });
  selectedStations.forEach((station) => {
    station.leituras?.forEach((item) => {
      grouped[item.data_leitura] = {
        ...(grouped[item.data_leitura] || { timestamp: item.data_leitura }),
        [`estacao_${station.id}`]: item[metric],
      };
    });
  });
  return Object.values(grouped).sort(
    (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function useCurrentUserId() {
  const [userId, setUserId] = useState<number | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id || decoded.sub);
      } catch {
        setUserId(null);
      }
    }
  }, []);
  return userId;
}

function useEstacao(estacaoId?: string) {
  const navigate = useNavigate();
  const [estacao, setEstacao] = useState<EstacaoResumo | null>(null);
  const [ultimaLeitura, setUltimaLeitura] = useState<Leitura | null>(null);
  const [todasEstacoes, setTodasEstacoes] = useState<EstacaoResumo[]>([]);
  const [convites, setConvites] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!estacaoId) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const [estacaoRes, ultimaRes, estacoesRes, convitesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/${estacaoId}`, { headers }),
          fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/${estacaoId}/leituras/ultima`, { headers }),
          fetch(`${import.meta.env.VITE_BACK_URL}/estacoes`, { headers }),
          fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/${estacaoId}/convites`, { headers }),
        ]);
        if (estacaoRes.status === 401 || ultimaRes.status === 401 || estacoesRes.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        const estacaoData = await estacaoRes.json();
        const ultimaData = await ultimaRes.json();
        const estacoesData = await estacoesRes.json();
        const convitesData = convitesRes.ok ? await convitesRes.json() : [];
        setEstacao(estacaoData);
        setUltimaLeitura(ultimaData);
        setTodasEstacoes(Array.isArray(estacoesData) ? estacoesData : estacoesData.rows || []);
        setConvites(Array.isArray(convitesData) ? convitesData : convitesData.rows || []);
      } catch {
        setError("Não foi possível carregar os dados da estação.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [estacaoId, navigate]);

  return { estacao, ultimaLeitura, todasEstacoes, convites, setConvites, loading, error };
}

function useLeituras(estacaoId?: string) {
  const [filters, setFilters] = useState<LeiturasFilters>(defaultFilters);
  const [queryState, setQueryState] = useState<QueryState>({
    page: 1,
    limit: 10,
    sort: "data_leitura:desc",
  });
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!estacaoId) return;
    const run = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const qs = buildQuery(filters, queryState);
        const res = await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/${estacaoId}/leituras?${qs}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRawResponse(data);
        setLeituras(Array.isArray(data) ? data : data.rows || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [estacaoId, filters, queryState]);

  return { filters, setFilters, queryState, setQueryState, leituras, rawResponse, loading };
}

interface SmallFiltersPanelProps {
  filters: LeiturasFilters;
  queryState: QueryState;
  onChangeFilters: (fn: (prev: LeiturasFilters) => LeiturasFilters) => void;
  onChangeQueryState: (fn: (prev: QueryState) => QueryState) => void;
  onReset: () => void;
}

function SmallFiltersPanel({ filters, queryState, onChangeFilters, onChangeQueryState, onReset }: SmallFiltersPanelProps) {
  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">Filtros da estação atual</p>
          <h2 className="mt-1 text-lg font-bold text-gray-900">Refinar leituras</h2>
        </div>
        <button onClick={onReset} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">Limpar</button>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} type="datetime-local" value={filters.criadaDepois} onChange={(e) => onChangeFilters((prev: LeiturasFilters) => ({ ...prev, criadaDepois: e.target.value }))} />
          <input className={inputClass} type="datetime-local" value={filters.criadaAntes} onChange={(e) => onChangeFilters((prev: LeiturasFilters) => ({ ...prev, criadaAntes: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className={inputClass} value={queryState.sort} onChange={(e) => onChangeQueryState((prev: QueryState) => ({ ...prev, sort: e.target.value, page: 1 }))}>
            <option value="data_leitura:desc">Mais recentes</option>
            <option value="data_leitura:asc">Mais antigas</option>
            <option value="temperatura:desc">Temperatura desc</option>
            <option value="temperatura:asc">Temperatura asc</option>
            <option value="umidade:desc">Umidade desc</option>
            <option value="umidade:asc">Umidade asc</option>
          </select>
          <select className={inputClass} value={queryState.limit} onChange={(e) => onChangeQueryState((prev: QueryState) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}>
            <option value={10}>10 linhas</option>
            <option value={20}>20 linhas</option>
            <option value={50}>50 linhas</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} type="number" placeholder="Temp min" value={filters.temperatura_min} onChange={(e) => onChangeFilters((prev: LeiturasFilters) => ({ ...prev, temperatura_min: e.target.value }))} />
          <input className={inputClass} type="number" placeholder="Temp max" value={filters.temperatura_max} onChange={(e) => onChangeFilters((prev: LeiturasFilters) => ({ ...prev, temperatura_max: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} type="number" placeholder="Umidade min" value={filters.umidade_min} onChange={(e) => onChangeFilters((prev: LeiturasFilters) => ({ ...prev, umidade_min: e.target.value }))} />
          <input className={inputClass} type="number" placeholder="Umidade max" value={filters.umidade_max} onChange={(e) => onChangeFilters((prev: LeiturasFilters) => ({ ...prev, umidade_max: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} type="number" placeholder="Precipitação min" value={filters.precipitacao_min} onChange={(e) => onChangeFilters((prev: LeiturasFilters) => ({ ...prev, precipitacao_min: e.target.value }))} />
          <input className={inputClass} type="number" placeholder="Precipitação max" value={filters.precipitacao_max} onChange={(e) => onChangeFilters((prev: LeiturasFilters) => ({ ...prev, precipitacao_max: e.target.value }))} />
        </div>
      </div>
    </section>
  );
}

interface InsightPanelProps {
  estacao: EstacaoResumo;
  convites: Convite[];
  logs: any[];
  activeTab: InsightTab;
  onChangeTab: (tab: InsightTab) => void;
  onCreateInvite: (email: string) => Promise<void>;
  onRequestAccess: () => Promise<void>;
  creatingInvite: boolean;
  requestingAccess: boolean;
  accessRequestStatus: string | null;
  inviteError: string | null;
}

function InsightPanel({ estacao, convites, logs, activeTab, onChangeTab, onCreateInvite, onRequestAccess, creatingInvite, inviteError, requestingAccess, accessRequestStatus }: InsightPanelProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const tabClass = (tab: InsightTab) => `rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab ? "bg-green-600 text-white shadow-sm" : "bg-green-50 text-green-700 hover:bg-green-100"}`;
  const statusStyles: Record<string, string> = { PENDENTE: "bg-yellow-100 text-yellow-700", ACEITO: "bg-green-100 text-green-700", REJEITADO: "bg-red-100 text-red-700" };
  const isOwner = estacao.usuario_proprietario_id === (window as any).__CURRENT_USER_ID__;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div><h2 className="mt-1 text-xl font-bold text-gray-900">Contexto da estação</h2></div>
        <div className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${statusMap[estacao.status]}`}>{estacao.status}</div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button onClick={() => onChangeTab("logs")} className={tabClass("logs")}>Logs</button>
        <button onClick={() => onChangeTab("convites")} className={tabClass("convites")}>Convites</button>
      </div>
      {activeTab === "logs" ? (
        <div className="space-y-3">
          {logs.length ? logs.map((log: any) => (
            <article key={log.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">{log.titulo}</p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">{log.tipo}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">{log.descricao}</p>
            </article>
          )) : <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">Sem logs para esta estação.</div>}
        </div>
      ) : (
        <div className="space-y-4">
          {isOwner ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-semibold text-gray-900">Convidar usuário</p>
              <div className="space-y-3">
                <input type="email" autoComplete="off" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@instituicao.edu.br" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 text-gray-800" disabled={creatingInvite} />
                <button onClick={() => { if (!inviteEmail.trim() || creatingInvite) return; onCreateInvite(inviteEmail.trim()); setInviteEmail(""); }} disabled={creatingInvite} className="rounded-xl bg-green-600 px-4 py-2 text-white font-semibold transition hover:bg-green-700 disabled:opacity-50">
                  {creatingInvite ? "Enviando..." : "Enviar convite"}
                </button>
                {inviteError && <p className="text-xs text-red-500">{inviteError}</p>}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-semibold text-gray-900">Solicitar acesso</p>
              <button onClick={onRequestAccess} disabled={requestingAccess} className="rounded-xl bg-green-600 px-4 py-2 text-white font-semibold transition hover:bg-green-700 disabled:opacity-50">
                {requestingAccess ? "Enviando..." : "Pedir acesso à estação"}
              </button>
              {accessRequestStatus && <p className="mt-2 text-xs text-green-600">{accessRequestStatus}</p>}
              {inviteError && <p className="mt-2 text-xs text-red-500">{inviteError}</p>}
            </div>
          )}
          <div className="space-y-3">
            {convites.length ? convites.map((invite: Convite, index: number) => (
              <article key={invite.id || invite.token || index} className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{invite.email || invite.nome || "Convite"}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(invite.criado_em)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[(invite.status || "PENDENTE").toUpperCase()]}`}>
                    {invite.status || "PENDENTE"}
                  </span>
                </div>
              </article>
            )) : <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">Nenhum convite encontrado para esta estação.</div>}
          </div>
        </div>
      )}
    </section>
  );
}

interface MetricChartPanelProps {
  chartData: any[];
  overlayData: any[];
  overlayStations: EstacaoResumo[];
  activeMetric: MetricTab;
  onMetricChange: (metric: MetricTab) => void;
  loading: boolean;
}

function MetricChartPanel({ chartData, overlayData, overlayStations, activeMetric, onMetricChange, loading }: MetricChartPanelProps) {
  const current = metricConfig[activeMetric];
  const metrics = Object.keys(metricConfig) as MetricTab[];
  const lineColors = ["#0f766e", "#0284c7", "#ef4444", "#7c3aed"];
  if (loading) return <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md"><div className="h-[420px] animate-pulse rounded-xl bg-gray-100" /></section>;
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">Resultado filtrado</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">Leituras por métrica</h2>
          <p className="mt-2 text-sm text-gray-500">Clique em uma métrica para trocar o gráfico principal sem sair da estação analisada.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => {
            const conf = metricConfig[metric];
            const active = metric === activeMetric;
            return <button key={metric} onClick={() => onMetricChange(metric)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${active ? "border-green-600 bg-green-600 text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>{conf.label}</button>;
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h3 className="text-lg font-bold text-gray-900">{current.label} ao longo do tempo</h3><p className="text-sm text-gray-500">Leituras filtradas da estação atual.</p></div>
            <div className="rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm">{chartData.length} pontos</div>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs><linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={current.color} stopOpacity={0.35} /><stop offset="95%" stopColor={current.color} stopOpacity={0.03} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestampLabel" minTickGap={24} />
                <YAxis /><Tooltip />
                <Area type="monotone" dataKey={activeMetric} stroke={current.color} fill="url(#metricGradient)" strokeWidth={2.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-green-600 to-green-700 p-4 text-white shadow-md">
            <p className="text-xs uppercase tracking-wider text-green-100">Métrica ativa</p>
            <p className="mt-2 text-2xl font-bold">{current.label}</p>
            <p className="mt-2 text-sm text-green-100">Unidade: {current.unit}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Comparação entre estações</h3>
            <p className="mt-1 text-xs leading-5 text-gray-500">A mesma métrica aparece abaixo para a estação atual e para as selecionadas no mapa.</p>
            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overlayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit" })} minTickGap={24} />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(String(value)).toLocaleString("pt-BR")} />
                  <Legend />
                  {overlayStations.map((station: EstacaoResumo, index: number) => <Line key={station.id} type="monotone" dataKey={`estacao_${station.id}`} name={station.nome} stroke={lineColors[index % lineColors.length]} strokeWidth={2.2} dot={false} />)}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Main() {
  const { id } = useParams();
  const { estacao, ultimaLeitura, todasEstacoes, convites, setConvites, loading, error } = useEstacao(id);
  const { filters, setFilters, queryState, setQueryState, leituras, rawResponse, loading: loadingLeituras } = useLeituras(id);
  const currentUserId = useCurrentUserId();

  useEffect(() => {
    if (currentUserId) (window as any).__CURRENT_USER_ID__ = currentUserId;
  }, [currentUserId]);

  const [selectedStations, setSelectedStations] = useState<number[]>([]);
  const [nearestInfo, setNearestInfo] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [insightTab, setInsightTab] = useState<InsightTab>("logs");
  const [activeMetric, setActiveMetric] = useState<MetricTab>("temperatura");

  const [creatingInvite, setCreatingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [accessRequestStatus, setAccessRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!estacao || !ultimaLeitura) return;
    setLogs([
      { id: 1, tipo: "LEITURA", titulo: "Nova leitura registrada", descricao: `Temperatura ${formatNumber(ultimaLeitura.temperatura)}°C às ${formatDate(ultimaLeitura.data_leitura)}` },
      { id: 2, tipo: "ALERTA", titulo: "Análise de extremo térmico", descricao: ultimaLeitura.temperatura > 40 ? "Temperatura acima da faixa operacional recomendada." : "Sem extremos críticos recentes para temperatura." },
      { id: 3, tipo: "SISTEMA", titulo: "Sincronização concluída", descricao: "Leituras e contexto espacial carregados para a estação atual." },
    ]);
  }, [estacao, ultimaLeitura]);

  const selectedStationObjects = useMemo(() => todasEstacoes.filter((station) => selectedStations.includes(station.id) && station.id !== Number(id)), [todasEstacoes, selectedStations, id]);
  const chartData = useMemo(() => leituras.slice().sort((a, b) => new Date(a.data_leitura).getTime() - new Date(b.data_leitura).getTime()).map((item) => ({ ...item, timestampLabel: new Date(item.data_leitura).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) })), [leituras]);
  const overlayData = useMemo(() => buildOverlaySeries(leituras, selectedStationObjects, activeMetric), [leituras, selectedStationObjects, activeMetric]);

  const handleFindNearest = async () => {
    if (!estacao?.localizacao?.coordinates) return;
    const token = localStorage.getItem("token");
    const [longitude, latitude] = estacao.localizacao.coordinates;
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/maisProxima?latitude=${latitude}&longitude=${longitude}`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setNearestInfo(data);
  };

  const handleStationToggle = (stationId: number) => setSelectedStations((prev) => prev.includes(stationId) ? prev.filter((id) => id !== stationId) : [...prev, stationId].slice(-3));

  const handleCreateInvite = async (email: string) => {
    if (!id) { setInviteError("ID da estação não encontrado"); return; }
    if (!email || !email.includes("@")) { setInviteError("Email inválido"); return; }
    setCreatingInvite(true);
    setInviteError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Não autenticado");
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/${id}/convites/convidar`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.erro || `Erro ${response.status}`);
      }
      const created = await response.json();
      setConvites((prev) => [created, ...prev]);
      alert("Convite enviado com sucesso!");
    } catch (err: any) {
      setInviteError(err.message || "Erro ao enviar convite");
    } finally {
      setCreatingInvite(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!id) { setInviteError("ID da estação não encontrado"); return; }
    setRequestingAccess(true);
    setInviteError(null);
    setAccessRequestStatus(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Não autenticado");
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/${id}/convites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) throw new Error("Você já solicitou acesso a esta estação.");
        throw new Error(errorData.erro || `Erro ${response.status}`);
      }
      await response.json();
      setAccessRequestStatus("Pedido enviado! Aguarde a aprovação do proprietário.");
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setRequestingAccess(false);
    }
  };

  if (loading) return <div className="flex min-h-[70vh] items-center justify-center"><div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" /></div>;
  if (error || !estacao) return <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">{error || "Estação não encontrada."}</div>;

  return (
    <div className="space-y-8 pb-8">
      <div className="px-6 pt-4">
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"><FaArrowLeft /> Voltar para todas as estações</Link>
      </div>
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusMap[estacao.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>{estacao.status}</span>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-gray-700">Estação {estacao.id}</span>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-gray-700">Última leitura: <span className="font-bold">{formatDate(ultimaLeitura?.data_leitura)}</span></span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{estacao.nome}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">O foco desta tela é a estação selecionada, com mapa primeiro, filtros aplicados às leituras dela e gráfico alternável por métrica.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-sm"><p className="text-xs uppercase tracking-wider text-green-600">Leituras</p><p className="mt-1 text-xl font-semibold text-gray-900">{leituras.length}</p></div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-sm"><p className="text-xs uppercase tracking-wider text-green-600">Equipe</p><p className="mt-1 text-xl font-semibold text-gray-900">{estacao.equipe?.length ?? 0}</p></div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-sm"><p className="text-xs uppercase tracking-wider text-green-600">Convites</p><p className="mt-1 text-xl font-semibold text-gray-900">{convites.length}</p></div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-sm"><p className="text-xs uppercase tracking-wider text-green-600">Fonte</p><p className="mt-1 text-sm font-semibold text-gray-900">Redis + API</p></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div><div className="inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"><FaSatellite /> mapa da estação</div><h2 className="mt-3 text-2xl font-bold text-gray-900">Mapa e busca de estação</h2><p className="mt-2 text-sm text-gray-500">Busque a estação mais próxima e selecione pontos para comparação diretamente na área principal.</p></div>
              <button onClick={handleFindNearest} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"><FaMagnifyingGlass /> Buscar estação mais próxima</button>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><Map altura="500px" center={[estacao.localizacao.coordinates[1], estacao.localizacao.coordinates[0]]} /></div>
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800"><FaLocationDot className="text-green-600" /> Comparar estações</div>
                  <div className="max-h-[270px] space-y-2 overflow-y-auto pr-1">
                    {todasEstacoes.map((station) => (<label key={station.id} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${selectedStations.includes(station.id) ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}><div className="min-w-0 pr-3"><p className="truncate font-semibold text-gray-900">{station.nome}</p><p className="text-xs text-gray-500">ID {station.id}</p></div><input type="checkbox" checked={selectedStations.includes(station.id)} onChange={() => handleStationToggle(station.id)} disabled={station.id === estacao.id} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" /></label>))}
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-700 to-green-800 p-4 text-white shadow-md">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white"><FaChevronRight className="text-green-300" /> Resultado da busca</div>
                  {nearestInfo ? (<div className="mt-3 space-y-2 text-sm text-green-100"><p className="text-base font-semibold text-white">{nearestInfo.nome || nearestInfo.estacao?.nome || "Resultado"}</p><p>{nearestInfo.endereco || nearestInfo.estacao?.endereco || "Sem endereço disponível"}</p></div>) : (<p className="mt-3 text-sm text-green-100">Clique em buscar para carregar a estação mais próxima com base na estação que você está analisando.</p>)}
                </div>
              </div>
            </div>
          </section>
          <InsightPanel
            estacao={estacao}
            convites={convites}
            logs={logs}
            activeTab={insightTab}
            onChangeTab={setInsightTab}
            onCreateInvite={handleCreateInvite}
            onRequestAccess={handleRequestAccess}
            creatingInvite={creatingInvite}
            requestingAccess={requestingAccess}
            accessRequestStatus={accessRequestStatus}
            inviteError={inviteError}
          />
        </div>
      </section>
      <section className="grid grid-cols-1 gap-8 2xl:grid-cols-[0.62fr_1.38fr]">
        <div className="space-y-6">
          <SmallFiltersPanel filters={filters} queryState={queryState} onChangeFilters={setFilters} onChangeQueryState={setQueryState} onReset={() => { setFilters(defaultFilters); setQueryState({ page: 1, limit: 10, sort: "data_leitura:desc" }); }} />
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800"><FaTableList className="text-green-600" /> Resumo rápido da estação</div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4"><p className="text-gray-500">Endereço</p><p className="mt-1 font-semibold text-gray-900">{estacao.endereco}</p></div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4"><p className="text-gray-500">Última temperatura</p><p className="mt-1 font-semibold text-gray-900">{formatNumber(ultimaLeitura?.temperatura)} °C</p></div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4"><p className="text-gray-500">Última precipitação</p><p className="mt-1 font-semibold text-gray-900">{formatNumber(ultimaLeitura?.precipitacao)} mm</p></div>
            </div>
          </section>
        </div>
        <MetricChartPanel chartData={chartData} overlayData={overlayData} overlayStations={[estacao, ...selectedStationObjects]} activeMetric={activeMetric} onMetricChange={setActiveMetric} loading={loadingLeituras} />
      </section>
      <TableLeituras leituras={leituras} rawResponse={rawResponse} queryState={queryState} onChangeQueryState={setQueryState} />
    </div>
  );
}
