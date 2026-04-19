import type { MetricConfig, LeiturasFilters } from "../types";

export const statusMap: Record<string, string> = {
  ATIVA: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INATIVA: "bg-amber-100 text-amber-700 border-amber-200",
  MANUTENCAO: "bg-sky-100 text-sky-700 border-sky-200",
};

export const metricConfig: Record<string, MetricConfig> = {
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

export const defaultFilters: LeiturasFilters = {
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
