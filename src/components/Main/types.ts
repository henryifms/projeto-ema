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

export type InsightTab = "logs" | "convites";
export type MetricTab =
  | "temperatura"
  | "umidade"
  | "pressao_atmosferica"
  | "velocidade_vento"
  | "precipitacao";

export interface QueryState {
  page: number;
  limit: number;
  sort: string;
}

export interface LeiturasFilters {
  criadaDepois: string;
  criadaAntes: string;
  temperatura_min: string;
  temperatura_max: string;
  umidade_min: string;
  umidade_max: string;
  pressao_atmosferica_min: string;
  pressao_atmosferica_max: string;
  velocidade_vento_min: string;
  velocidade_vento_max: string;
  precipitacao_min: string;
  precipitacao_max: string;
}

export interface MetricConfig {
  label: string;
  unit: string;
  color: string;
  area: string;
}

export interface InsightPanelProps {
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

export interface SmallFiltersPanelProps {
  filters: LeiturasFilters;
  queryState: QueryState;
  onChangeFilters: (fn: (prev: LeiturasFilters) => LeiturasFilters) => void;
  onChangeQueryState: (fn: (prev: QueryState) => QueryState) => void;
  onReset: () => void;
}

export interface MetricChartPanelProps {
  chartData: any[];
  overlayData: any[];
  overlayStations: EstacaoResumo[];
  activeMetric: MetricTab;
  onMetricChange: (metric: MetricTab) => void;
  loading: boolean;
}

export interface LogEntry {
  id: number;
  tipo: string;
  titulo: string;
  descricao: string;
}

export interface NearestStationInfo {
  nome?: string;
  endereco?: string;
  estacao?: {
    nome: string;
    endereco: string;
  };
}

export interface RawApiResponse {
  rows?: Leitura[];
  count?: number;
  [key: string]: unknown;
}
