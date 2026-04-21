import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface DadoPrevisao {
  hora: string;
  temp: number;
  precip: number;
}

interface GraphicsProps {
  dadosPrevisao: DadoPrevisao[];
  setDadosPrevisao: (dados: DadoPrevisao[]) => void;
  loading: boolean;
  setLoading: (valor: boolean) => void;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

const HourlyForecast = ({
  dadosPrevisao,
  setDadosPrevisao,
  loading,
  setLoading,
  estacaoIdExterna,
}: GraphicsProps & { estacaoIdExterna?: string | null }) => {
  const [estacaoId, setEstacaoId] = useState<number | null>(null);
  const [horaAtual, setHoraAtual] = useState("");
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [dadosAtuais, setDadosAtuais] = useState<any>(null);

  const getWeatherImage = (precip: number, temp: number) => {
    if (precip > 70) return "/projeto-ema/chuva.png";
    if (precip > 30) return "/projeto-ema/nublado.png";
    if (temp > 30) return "/projeto-ema/sol.png";
    return "/projeto-ema/parcial.png";
  };

  useEffect(() => {
    const atualizarHora = () => {
      const agora = new Date();
      setHoraAtual(
        agora.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    atualizarHora();
    const interval = setInterval(atualizarHora, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const definirEstacaoPadrao = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes`);
        const estacoes = await res.json();
        if (Array.isArray(estacoes) && estacoes.length > 0) {
          const menorId = estacoes.sort((a: any, b: any) => a.id - b.id)[0].id;
          setEstacaoId(menorId);
        }
      } catch (err) {
        console.error("Erro ao definir estação padrão:", err);
      }
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `${import.meta.env.VITE_BACK_URL}/estacoes/maisProxima`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                localizacao: { latitude, longitude },
              }),
            },
          );

          if (!res.ok) throw new Error();

          const estacao = await res.json();
          setEstacaoId(estacao.id);
        } catch {
          definirEstacaoPadrao();
        }
      },
      () => definirEstacaoPadrao(),
    );
  }, []);

  useEffect(() => {
    const id = estacaoIdExterna || estacaoId;
    if (!id) return;

    const buscarDados = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/estacoes/${id}/leituras`,
        );

        if (!response.ok) throw new Error();

        const json = await response.json();

        if (Array.isArray(json) && json.length > 0) {
          const ordenados = json.sort(
            (a: any, b: any) =>
              new Date(b.data_leitura).getTime() -
              new Date(a.data_leitura).getTime(),
          );

          setDadosAtuais(ordenados[0]);

          const horasVistas = new Set<number>();
          const formatados: DadoPrevisao[] = [];

          for (const item of ordenados) {
            const data = new Date(item.data_leitura);
            const hora = data.getHours();

            if (!horasVistas.has(hora)) {
              horasVistas.add(hora);
              formatados.push({
                hora: `${hora.toString().padStart(2, "0")}:00`,
                temp: item.temperatura,
                precip: item.precipitacao,
              });
            }
            if (formatados.length >= 12) break;
          }

          setDadosPrevisao(formatados.reverse());
        } else {
          setDadosAtuais(null);
          setDadosPrevisao([]);
        }
      } catch (error) {
        console.error("Erro ao carregar gráfico:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [estacaoId, estacaoIdExterna]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/80 backdrop-blur-md p-3 rounded-xl text-xs">
          <p className="text-green-400 font-medium">{label}</p>
          <span className="text-white font-semibold">{payload[0].value}°C</span>
        </div>
      );
    }
    return null;
  };

  const climaAtual = dadosAtuais;

  return (
    <>
      {/* CARD CLIMA */}
      <div className="bg-white border w-[340px] h-[380px] mx-auto rounded-2xl flex flex-col items-center gap-4 p-3 shadow-sm">
        <div className="relative w-full flex justify-center">
          <img
            src={
              climaAtual
                ? getWeatherImage(
                    climaAtual.precipitacao,
                    climaAtual.temperatura,
                  )
                : "/projeto-ema/default.png"
            }
            className="h-[200px] w-full rounded-xl object-cover"
          />

          <span className="absolute top-2 right-3 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
            {horaAtual}
          </span>

          <button
            onClick={() => setMostrarAviso(true)}
            className="absolute top-2 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg"
          >
            !
          </button>
        </div>

        <div className="w-full flex flex-wrap gap-2 justify-center">
          {climaAtual &&
            [
              { label: "Temp", value: `${climaAtual.temperatura}°C` },
              { label: "Chuva", value: `${climaAtual.precipitacao}%` },
              {
                label: "Pressão",
                value: `${climaAtual.pressao_atmosferica} hPa`,
              },
              { label: "Umidade", value: `${climaAtual.umidade}%` },
              { label: "Vento", value: `${climaAtual.velocidade_vento} km/h` },
              {
                label: "Hora",
                value: new Date(climaAtual.data_leitura).getHours() + "h",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="h-[60px] w-[97px] bg-orange-50 rounded-lg border flex flex-col items-center justify-center"
              >
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* MODAL ALERTA */}
      {mostrarAviso && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Alerta</h2>
            <p className="text-sm text-gray-600 mb-4">
              Possível mudança no clima.
            </p>
            <button
              onClick={() => setMostrarAviso(false)}
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* GRÁFICO */}
      <div className="bg-white border h-[380px] rounded-2xl flex-grow p-4 shadow-sm">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Previsão horária
        </h4>

        <div className="h-[300px] w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              Carregando...
            </div>
          ) : (
            <ResponsiveContainer width="99%" height="100%">
              <LineChart data={dadosPrevisao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis unit="°" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  dataKey="temp"
                  stroke="#60a5fb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default HourlyForecast;
