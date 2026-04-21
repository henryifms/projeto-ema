import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GraphPanelProps {
  chartData: any[];
  histogramData: any[];
  overlayData: any[];
  overlayStations: Array<{ id: number; nome: string }>;
  loading?: boolean;
}

const panelClass = "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";
const colors = ["#0f766e", "#0284c7", "#ea580c", "#7c3aed"];

export default function GraphPanel({
  chartData,
  histogramData,
  overlayData,
  overlayStations,
  loading,
}: GraphPanelProps) {
  if (loading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-950">
          Análise gráfica
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Séries temporais, gráfico combinado, distribuição e comparação entre
          estações.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
        <div className={panelClass}>
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Temperatura ao longo do tempo
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestampLabel" minTickGap={24} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperatura"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={panelClass}>
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Umidade ao longo do tempo
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestampLabel" minTickGap={24} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="umidade"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={panelClass}>
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Pressão atmosférica ao longo do tempo
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestampLabel" minTickGap={24} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pressao_atmosferica"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={panelClass}>
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Temperatura + umidade
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestampLabel" minTickGap={24} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="umidade"
                  fill="#bae6fd"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperatura"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={panelClass}>
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Histograma de temperatura
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="faixa" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={panelClass}>
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Overlay entre estações
          </h3>
          <div className="h-72">
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
                {overlayStations.map((station, index) => (
                  <Line
                    key={station.id}
                    type="monotone"
                    dataKey={`estacao_${station.id}`}
                    name={station.nome}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
