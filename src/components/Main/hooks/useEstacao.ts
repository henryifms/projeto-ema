import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { EstacaoResumo, Leitura, Convite } from "../types";

export function useEstacao(estacaoId?: string) {
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

        const [estacaoRes, ultimaRes, estacoesRes, convitesRes] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/${estacaoId}`, {
              headers,
            }),
            fetch(
              `${import.meta.env.VITE_BACK_URL}/estacoes/${estacaoId}/leituras/ultima`,
              { headers },
            ),
            fetch(`${import.meta.env.VITE_BACK_URL}/estacoes`, { headers }),
            fetch(
              `${import.meta.env.VITE_BACK_URL}/estacoes/${estacaoId}/convites`,
              { headers },
            ),
          ]);

        if (
          estacaoRes.status === 401 ||
          ultimaRes.status === 401 ||
          estacoesRes.status === 401
        ) {
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
        setTodasEstacoes(
          Array.isArray(estacoesData) ? estacoesData : estacoesData.rows || [],
        );
        setConvites(
          Array.isArray(convitesData) ? convitesData : convitesData.rows || [],
        );
      } catch {
        setError("Não foi possível carregar os dados da estação.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [estacaoId, navigate]);

  return {
    estacao,
    ultimaLeitura,
    todasEstacoes,
    convites,
    setConvites,
    loading,
    error,
  };
}
