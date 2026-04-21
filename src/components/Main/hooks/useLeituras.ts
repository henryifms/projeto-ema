import { useState, useEffect } from "react";
import type { Leitura, RawApiResponse } from "../types";
import type { QueryState, LeiturasFilters } from "../types";
import { buildQuery } from "../utils/builders";
import { defaultFilters } from "../utils/constants";

export function useLeituras(estacaoId?: string) {
  const [filters, setFilters] = useState<LeiturasFilters>(defaultFilters);
  const [queryState, setQueryState] = useState<QueryState>({
    page: 1,
    limit: 10,
    sort: "data_leitura:desc",
  });
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [rawResponse, setRawResponse] = useState<RawApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!estacaoId) return;

    const run = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const qs = buildQuery(filters, queryState);
        const res = await fetch(
          `${import.meta.env.VITE_BACK_URL}/estacoes/${estacaoId}/leituras?${qs}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        setRawResponse(data);
        setLeituras(Array.isArray(data) ? data : data.rows || []);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [estacaoId, filters, queryState]);

  return {
    filters,
    setFilters,
    queryState,
    setQueryState,
    leituras,
    rawResponse,
    loading,
  };
}
