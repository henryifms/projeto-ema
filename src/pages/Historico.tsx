import { useParams } from "react-router-dom";
import TableLeituras from "../components/TableLeituras";
import { useLeituras } from "../components/Main/hooks/useLeituras";
// import FiltersPanel from "../components/FiltersPanel";
import { useMemo, useState } from "react";
import { SmallFiltersPanel } from "../components/Main/components/SmallFiltersPanel";
import { MetricChartPanel } from "../components/Main/components/MetricChartPanel";
import { buildOverlaySeries } from "../components/Main/utils/builders";
import type { MetricTab } from "../components/Main/types";

const Historico = () => {
  const { id } = useParams();

  const {
  filters,
  setFilters,
  leituras,
  rawResponse,
  queryState,
  setQueryState,
  loading,
} = useLeituras(id);

  const [activeMetric, setActiveMetric] = useState("temperatura");

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

const overlayData = buildOverlaySeries(
  leituras,
  [],
  activeMetric,
);

  if (loading) {
    return <div>Carregando histórico...</div>;
  }

  return (
  <div className="grid grid-cols-[320px_1fr] gap-6 items-start">
    
    {/* COLUNA ESQUERDA */}
    <div className="h-full py-15">
      <SmallFiltersPanel
        filters={filters}
        queryState={queryState}
        onChangeFilters={setFilters}
        onChangeQueryState={setQueryState}
        onReset={() => {
          setQueryState({
            page: 1,
            limit: 10,
            sort: "data_leitura:desc",
          });
        }}
      />
    </div>

    {/* COLUNA DIREITA */}
    <div className="flex flex-col gap-6">
      
      {/* GRÁFICO */}
      <div className="w-full max-w-5xl">
        <MetricChartPanel
          chartData={chartData}
          overlayData={overlayData}
          overlayStations={[]}
          activeMetric={activeMetric}
          onMetricChange={setActiveMetric}
          loading={loading}
        />
      </div>

      {/* TABELA */}
      <div className="w-full max-w-5xl">
        <TableLeituras
          leituras={leituras}
          rawResponse={rawResponse}
          queryState={queryState}
          onChangeQueryState={setQueryState}
        />
      </div>

    </div>
  </div>
);};

export default Historico;
