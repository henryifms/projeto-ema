import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MetricChartPanelProps } from "../types";
import { metricConfig } from "../utils/constants";

export function MetricChartPanel({
  chartData,
  activeMetric,
  onMetricChange,
  loading,
}: MetricChartPanelProps) {
  const current = metricConfig[activeMetric];
  const metrics = Object.keys(metricConfig) as Array<
    keyof typeof metricConfig
  >;

  if (loading)
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md ">
        <div className="h-[420px] animate-pulse rounded-xl bg-gray-100" />
      </section>
    );

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
          Resultado filtrado
        </p>

      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {current.label} ao longo do tempo
              </h3>

            </div>

            <div className="rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm">
              {chartData.length} pontos
            </div>
          </div>

          <div className="h-[250px]">
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

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="timestampLabel"
                  minTickGap={24}
                />

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

        <div className="flex flex-col gap-2">
          {metrics.map((metric) => {
            const conf = metricConfig[metric];
            const active = metric === activeMetric;

            return (
              <button
                key={metric}
                onClick={() => onMetricChange(metric as any)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{conf.label}</span>

                  <div
                    className="h-3 w-3 rounded-full"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
