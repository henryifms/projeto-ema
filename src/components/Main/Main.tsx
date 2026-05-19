import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TableLeituras from "../TableLeituras";
import { useCurrentUserId } from "./hooks/useCurrentUserId";
import { useEstacao } from "./hooks/useEstacao";
import { useLeituras } from "./hooks/useLeituras";
import { EstacaoHeader } from "./components/EstacaoHeader";
import { MapSection } from "./components/MapSection";
import { InsightPanel } from "./components/InsightPanel";
import { SmallFiltersPanel } from "./components/SmallFiltersPanel";
import { MetricChartPanel } from "./components/MetricChartPanel";
import { StationInfo } from "./components/StationInfo";
import { buildOverlaySeries } from "./utils/builders";
import { formatNumber, formatDate } from "./utils/formatters";
import type { MetricTab, NearestStationInfo, LogEntry } from "./types";
import SobreEstacao from "../SobreEstacao.tsx"

export default function Main() {
  const { id } = useParams();
  const {
    estacao,
    ultimaLeitura,
    todasEstacoes,
    convites,
    setConvites,
    loading,
    error,
  } = useEstacao(id);
  const {
    filters,
    setFilters,
    queryState,
    setQueryState,
    leituras,
    rawResponse,
    loading: loadingLeituras,
  } = useLeituras(id);
  const currentUserId = useCurrentUserId();

  const [selectedStations, setSelectedStations] = useState<number[]>([]);
  const [nearestInfo, setNearestInfo] = useState<NearestStationInfo | null>(
    null,
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [insightTab, setInsightTab] = useState<"logs" | "convites">("logs");
  const [activeMetric, setActiveMetric] = useState<MetricTab>("temperatura");

  const [creatingInvite, setCreatingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [accessRequestStatus, setAccessRequestStatus] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (currentUserId)
      (window as { __CURRENT_USER_ID__?: number }).__CURRENT_USER_ID__ =
        currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    if (!estacao || !ultimaLeitura) return;
    setLogs([
      {
        id: 1,
        tipo: "LEITURA",
        titulo: "Nova leitura registrada",
        descricao: `Temperatura ${formatNumber(ultimaLeitura.temperatura)}°C às ${formatDate(
          ultimaLeitura.data_leitura,
        )}`,
      },
      {
        id: 2,
        tipo: "ALERTA",
        titulo: "Análise de extremo térmico",
        descricao:
          ultimaLeitura.temperatura > 40
            ? "Temperatura acima da faixa operacional recomendada."
            : "Sem extremos críticos recentes para temperatura.",
      },
      {
        id: 3,
        tipo: "SISTEMA",
        titulo: "Sincronização concluída",
        descricao:
          "Leituras e contexto espacial carregados para a estação atual.",
      },
    ]);
  }, [estacao, ultimaLeitura]);

  const selectedStationObjects = useMemo(
    () =>
      todasEstacoes.filter(
        (station) =>
          selectedStations.includes(station.id) && station.id !== Number(id),
      ),
    [todasEstacoes, selectedStations, id],
  );

  const chartData = useMemo(
    () =>
      leituras
        .slice()
        .sort(
          (a, b) =>
            new Date(a.data_leitura).getTime() -
            new Date(b.data_leitura).getTime(),
        )
        .map((item) => ({
          ...item,
          timestampLabel: new Date(item.data_leitura).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
    [leituras],
  );

  const overlayData = useMemo(
    () => buildOverlaySeries(leituras, selectedStationObjects, activeMetric),
    [leituras, selectedStationObjects, activeMetric],
  );

  const handleFindNearest = async () => {
    if (!estacao?.localizacao?.coordinates) return;
    const token = localStorage.getItem("token");
    const [longitude, latitude] = estacao.localizacao.coordinates;
    const res = await fetch(
      `${import.meta.env.VITE_BACK_URL}/estacoes/maisProxima?latitude=${latitude}&longitude=${longitude}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = (await res.json()) as NearestStationInfo;
    setNearestInfo(data);
  };

  const handleStationToggle = (stationId: number) =>
    setSelectedStations((prev) =>
      prev.includes(stationId)
        ? prev.filter((id) => id !== stationId)
        : [...prev, stationId].slice(-3),
    );

  const handleCreateInvite = async (email: string) => {
    if (!id) {
      setInviteError("ID da estação não encontrado");
      return;
    }
    if (!email || !email.includes("@")) {
      setInviteError("Email inválido");
      return;
    }
    setCreatingInvite(true);
    setInviteError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Não autenticado");
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/estacoes/${id}/convites/convidar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        },
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}) as { erro?: string });
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
    if (!id) {
      setInviteError("ID da estação não encontrado");
      return;
    }
    setRequestingAccess(true);
    setInviteError(null);
    setAccessRequestStatus(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Não autenticado");
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/estacoes/${id}/convites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409)
          throw new Error("Você já solicitou acesso a esta estação.");
        throw new Error(errorData.erro || `Erro ${response.status}`);
      }
      await response.json();
      setAccessRequestStatus(
        "Pedido enviado! Aguarde a aprovação do proprietário.",
      );
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setRequestingAccess(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
      </div>
    );

  if (error || !estacao)
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
        {error || "Estação não encontrada."}
      </div>
    );

  return (
    <div className="space-y-8 pb-8">
      <EstacaoHeader
        estacao={estacao}
        ultimaLeitura={ultimaLeitura}
        leiturasCount={leituras.length}
        equipeCount={estacao.equipe?.length ?? 0}
        convitesCount={convites.length}
      />

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
          <MapSection
            estacao={estacao}
            todasEstacoes={todasEstacoes}
            selectedStations={selectedStations}
            onStationToggle={handleStationToggle}
            onFindNearest={handleFindNearest}
            nearestInfo={nearestInfo}
          />

          <SobreEstacao />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 2xl:grid-cols-[0.62fr_1.38fr]">
        <div className="space-y-6">
          <SmallFiltersPanel
            filters={filters}
            queryState={queryState}
            onChangeFilters={setFilters}
            onChangeQueryState={setQueryState}
            onReset={() => {
              setFilters({
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
              });
              setQueryState({ page: 1, limit: 10, sort: "data_leitura:desc" });
            }}
          />
          <StationInfo estacao={estacao} ultimaLeitura={ultimaLeitura} />
        </div>

        <MetricChartPanel
          chartData={chartData}
          overlayData={overlayData}
          overlayStations={[estacao, ...selectedStationObjects]}
          activeMetric={activeMetric}
          onMetricChange={setActiveMetric}
          loading={loadingLeituras}
        />
      </section>

      <TableLeituras
        leituras={leituras}
        rawResponse={rawResponse}
        queryState={queryState}
        onChangeQueryState={setQueryState}
      />
    </div>
  );
}
