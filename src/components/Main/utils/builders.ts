import type { Leitura, EstacaoResumo } from "../types";
import type { QueryState, LeiturasFilters, MetricTab } from "../types";

export function buildQuery(filters: LeiturasFilters, queryState: QueryState) {
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

export function buildOverlaySeries(
  base: Leitura[],
  selectedStations: EstacaoResumo[],
  metric: MetricTab,
) {
  const grouped: Record<string, Record<string, unknown>> = {};

  base.forEach((item) => {
    grouped[item.data_leitura] = {
      ...(grouped[item.data_leitura] || {}),
      timestamp: item.data_leitura,
      [`estacao_${item.estacao_id}`]: item[metric],
    };
  });

  selectedStations.forEach((station) => {
    station.leituras?.forEach((item: Leitura) => {
      grouped[item.data_leitura] = {
        ...(grouped[item.data_leitura] || { timestamp: item.data_leitura }),
        [`estacao_${station.id}`]: item[metric],
      };
    });
  });

  return Object.values(grouped).sort((a, b) => {
    const timestampA = (a as { timestamp: string }).timestamp;
    const timestampB = (b as { timestamp: string }).timestamp;
    return new Date(timestampA).getTime() - new Date(timestampB).getTime();
  });
}
