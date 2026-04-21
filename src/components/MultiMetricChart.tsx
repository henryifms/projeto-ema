import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface MultiMetricCombinedChartProps {
  data: Array<{
    timestamp: string;
    timestampLabel: string;
    temperatura: number;
    umidade: number;
    pressao_atmosferica: number;
    velocidade_vento: number;
    precipitacao: number;
  }>;
  loading?: boolean;
}

export function MultiMetricCombinedChart({
  data,
  loading,
}: MultiMetricCombinedChartProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md h-[450px] animate-pulse">
        <div className="h-full bg-gray-100 rounded-xl" />
      </div>
    );
  }

  // Formatação customizada do tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[200px]">
          <p className="text-sm font-semibold text-gray-900 mb-2 border-b pb-1">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-xs py-1"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600">{entry.name}:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {entry.value?.toFixed(1)}
                {entry.unit || ""}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Evolução das Variáveis Meteorológicas
        </h2>
        <p className="text-sm text-gray-500">
          Temperatura, Umidade, Pressão, Vento e Precipitação
        </p>
      </div>

      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="timestampLabel"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />

            {/* Eixo esquerdo - Temperatura e Pressão */}
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Temperatura (°C) / Pressão (hPa)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#6b7280" },
                offset: -5,
              }}
            />

            {/* Eixo direito - Umidade */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Umidade (%)",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 11, fill: "#6b7280" },
                offset: -5,
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }}
              iconType="circle"
              verticalAlign="bottom"
              height={36}
            />

            {/* Linha de referência para o valor 0 */}
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />

            {/* Temperatura - Linha vermelha sólida */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperatura"
              name="Temperatura"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#ef4444",
                stroke: "white",
                strokeWidth: 2,
              }}
              unit="°C"
            />

            {/* Umidade - Área azul com transparência */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="umidade"
              name="Umidade"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
              dot={false}
              unit="%"
            />

            {/* Pressão - Linha laranja tracejada */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="pressao_atmosferica"
              name="Pressão"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              unit="hPa"
            />

            {/* Vento - Linha roxa */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="velocidade_vento"
              name="Vento"
              stroke="#a855f7"
              strokeWidth={2}
              dot={false}
              unit="km/h"
            />

            {/* Precipitação - Barras verdes */}
            <Bar
              yAxisId="left"
              dataKey="precipitacao"
              name="Precipitação"
              fill="#10b981"
              barSize={20}
              radius={[4, 4, 0, 0]}
              unit="mm"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda adicional explicativa */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-red-500" />
          <span>Temperatura (°C) - Eixo Esquerdo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-blue-500/20 border border-blue-500 rounded" />
          <span>Umidade (%) - Eixo Direito</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-orange-500 border-t-2 border-dashed" />
          <span>Pressão (hPa) - Eixo Esquerdo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-purple-500" />
          <span>Vento (km/h) - Eixo Esquerdo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 bg-emerald-500 rounded-sm" />
          <span>Precipitação (mm) - Eixo Esquerdo</span>
        </div>
      </div>
    </div>
  );
}
