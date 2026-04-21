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
import type { MetricChartPanelProps } from "../types";
import { metricConfig } from "../utils/constants";

export function MetricChartPanel({
  chartData,
  overlayData,
  overlayStations,
  activeMetric,
  onMetricChange,
  loading,
}: MetricChartPanelProps) {
  const current = metricConfig[activeMetric];
  const metrics = Object.keys(metricConfig) as Array<keyof typeof metricConfig>;
  const lineColors = ["#0f766e", "#0284c7", "#ef4444", "#7c3aed"];

  if (loading)
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <div className="h-[420px] animate-pulse rounded-xl bg-gray-100" />
      </section>
    );

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Resultado filtrado
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            Leituras por métrica
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Clique em uma métrica para trocar o gráfico principal sem sair da
            estação analisada.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => {
            const conf = metricConfig[metric];
            const active = metric === activeMetric;
            return (
              <button
                key={metric}
                onClick={() => onMetricChange(metric as any)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {conf.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {current.label} ao longo do tempo
              </h3>
              <p className="text-sm text-gray-500">
                Leituras filtradas da estação atual.
              </p>
            </div>
            <div className="rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm">
              {chartData.length} pontos
            </div>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="metricGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={current.color}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={current.color}
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestampLabel" minTickGap={24} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={current.color}
                  fill="url(#metricGradient)"
                  strokeWidth={2.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-green-600 to-green-700 p-4 text-white shadow-md">
            <p className="text-xs uppercase tracking-wider text-green-100">
              Métrica ativa
            </p>
            <p className="mt-2 text-2xl font-bold">{current.label}</p>
            <p className="mt-2 text-sm text-green-100">
              Unidade: {current.unit}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Comparação entre estações
            </h3>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              A mesma métrica aparece abaixo para a estação atual e para as
              selecionadas no mapa.
            </p>
            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overlayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                      })
                    }
                    minTickGap={24}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(String(value)).toLocaleString("pt-BR")
                    }
                  />
                  <Legend />
                  {overlayStations.map((station: any, index: number) => (
                    <Line
                      key={station.id}
                      type="monotone"
                      dataKey={`estacao_${station.id}`}
                      name={station.nome}
                      stroke={lineColors[index % lineColors.length]}
                      strokeWidth={2.2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
