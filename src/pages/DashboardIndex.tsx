import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Map from "../components/Map";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  FaThermometerHalf,
  FaTint,
  FaCloudRain,
  FaWind,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { WiBarometer } from "react-icons/wi";
import { Trash2, Edit3, Plus, Clock, AlertCircle } from "lucide-react";

type Estacao = {
  id: number;
  nome: string;
  status: string;
  endereco: string;
  leituras: Array<{ id: string; estacao_id: number }>; // Adicionado para contar leituras
  ultima_leitura?: {
    temperatura: number;
    data_leitura: string;
  };
};

type Leitura = {
  data_leitura: string;
  temperatura: number;
  umidade: number;
  precipitacao: number;
  pressao_atmosferica: number;
  velocidade_vento: number;
};

type Metric =
  | "temperatura"
  | "umidade"
  | "precipitacao"
  | "pressao_atmosferica"
  | "velocidade_vento";

const metricIcons = {
  temperatura: FaThermometerHalf,
  umidade: FaTint,
  precipitacao: FaCloudRain,
  pressao_atmosferica: WiBarometer,
  velocidade_vento: FaWind,
};

const stationColors = [
  "#0f766e",
  "#0284c7",
  "#ef4444",
  "#7c3aed",
  "#eab308",
  "#ec4899",
];

export default function DashboardIndex() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loadingEstacoes, setLoadingEstacoes] = useState(true);
  const [selectedStations, setSelectedStations] = useState<number[]>([]);
  const [stationsData, setStationsData] = useState<
    Record<number, { nome: string; leituras: Leitura[] }>
  >({});

  const [periodo, setPeriodo] = useState<"diario" | "mensal" | "anual">(
    "diario",
  );
  const [tipo, setTipo] = useState<"media" | "max" | "min">("media");
  const [metric, setMetric] = useState<Metric>("temperatura");

  // Modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editando, setEditando] = useState<Estacao | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    status: "INATIVA" as Estacao["status"],
  });
  const [submitting, setSubmitting] = useState(false);

  // Modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<Estacao | null>(null);

  const [openMap, setOpenMap] = useState(false);

  const token = localStorage.getItem("token") || "";

  // Calcular totais - CORRIGIDO: usa o array leituras que já vem da API
  const totalLeituras = useMemo(() => {
    return estacoes.reduce(
      (acc, estacao) => acc + (estacao.leituras?.length || 0),
      0
    );
  }, [estacoes]);

  const ativaCount = useMemo(() => {
    return estacoes.filter(e => e.status === "ATIVA").length;
  }, [estacoes]);

  const inputClass =
    "px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500";

  // Carrega a lista de todas as estações do usuário
  const fetchEstacoes = async () => {
    setLoadingEstacoes(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEstacoes(Array.isArray(data) ? data : data.rows || []);
    } catch (error) {
      console.error("Erro ao carregar estações:", error);
    } finally {
      setLoadingEstacoes(false);
    }
  };

  useEffect(() => {
    fetchEstacoes();
  }, []);

  // Carrega os dados detalhados (leituras) das estações selecionadas
  useEffect(() => {
    selectedStations.forEach(async (id) => {
      if (stationsData[id]) return;

      try {
        const resEstacao = await fetch(
          `${import.meta.env.VITE_BACK_URL}/estacoes/${id}`,
        );
        const estacao = await resEstacao.json();

        const resLeituras = await fetch(
          `${import.meta.env.VITE_BACK_URL}/estacoes/${id}/leituras`,
        );
        const leiturasData = await resLeituras.json();

        setStationsData((prev) => ({
          ...prev,
          [id]: {
            nome: estacao.nome || `Estação ${id}`,
            leituras: leiturasData.rows || leiturasData,
          },
        }));
      } catch (error) {
        console.error(`Erro ao carregar estação ${id}:`, error);
      }
    });
  }, [selectedStations]);

  const toggleStation = (id: number) => {
    setSelectedStations((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  // Funções do CRUD
  const openModal = (estacao?: Estacao) => {
    if (estacao) {
      setEditando(estacao);
      setFormData({
        nome: estacao.nome,
        endereco: estacao.endereco,
        status: estacao.status as Estacao["status"],
      });
    } else {
      setEditando(null);
      setFormData({ nome: "", endereco: "", status: "INATIVA" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) return;

    setSubmitting(true);
    try {
      const url = editando
        ? `${import.meta.env.VITE_BACK_URL}/estacoes/${editando.id}`
        : `${import.meta.env.VITE_BACK_URL}/estacoes`;

      await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setIsModalOpen(false);
      fetchEstacoes();
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (estacao: Estacao) => {
    setStationToDelete(estacao);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!stationToDelete) return;

    try {
      await fetch(
        `${import.meta.env.VITE_BACK_URL}/estacoes/${stationToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchEstacoes();
      // Remove da seleção se estava selecionada
      setSelectedStations((prev) =>
        prev.filter((s) => s !== stationToDelete.id),
      );
    } catch (error) {
      console.error("Erro ao deletar estação:", error);
    } finally {
      setShowDeleteModal(false);
      setStationToDelete(null);
    }
  };

  function groupData(leituras: Leitura[]) {
    const groups: Record<string, number[]> = {};

    leituras.forEach((l) => {
      const d = new Date(l.data_leitura);
      let key = "";
      if (periodo === "diario") key = d.toISOString().slice(0, 10);
      if (periodo === "mensal") key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (periodo === "anual") key = `${d.getFullYear()}`;

      if (!groups[key]) groups[key] = [];
      groups[key].push(l[metric]);
    });

    return Object.entries(groups).map(([k, values]) => {
      let val = 0;
      if (tipo === "media")
        val = values.reduce((a, b) => a + b, 0) / values.length;
      if (tipo === "max") val = Math.max(...values);
      if (tipo === "min") val = Math.min(...values);
      return { timestamp: k, value: val };
    });
  }

  const chartData = useMemo(() => {
    const map: Record<string, any> = {};

    selectedStations.forEach((id) => {
      const station = stationsData[id];
      if (!station) return;

      const grouped = groupData(station.leituras);
      grouped.forEach((p) => {
        if (!map[p.timestamp]) {
          map[p.timestamp] = { timestamp: p.timestamp };
        }
        map[p.timestamp][`station_${id}`] = p.value;
      });
    });

    return Object.values(map);
  }, [stationsData, selectedStations, periodo, tipo, metric]);

  return (
    <div className="w-full flex justify-center flex-col mx-auto px-65 space-y-10">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm">
            {estacoes.length} estações
          </div>
          <div className="flex items-center gap-1 text-sm px-4 py-2 rounded-xl backdrop-blur-sm bg-green-100 text-green-800">
            {ativaCount} ativas
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm">
            {totalLeituras} leituras
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Nova Estação
          </button>
        </div>
      </div>

      {/* Mapa + Gráfico */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-6xl w-full">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm relative group overflow-hidden">
            <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/5 transition-all duration-200 pointer-events-none" />

            <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
              <span className="text-xs font-bold text-gray-600">
                Clique para expandir
              </span>
            </div>

            <div
              onClick={() => setOpenMap(true)}
              className="absolute inset-0 z-30 cursor-pointer"
            />

            <Map
              altura="100%"
              selectedStations={selectedStations}
              onToggleEstacao={toggleStation}
            />
          </div>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Comparação entre estações
              </h2>
            </div>

            <div className="flex gap-3 mb-6">
              <select
                className={inputClass}
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as any)}
              >
                <option value="diario">Diário</option>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>

              <select
                className={inputClass}
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
              >
                <option value="media">Média</option>
                <option value="max">Máx</option>
                <option value="min">Min</option>
              </select>
            </div>

            <div className="grid grid-cols-[1fr_64px] gap-4">
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-slate-700">
                    {selectedStations.length}{" "}
                    {selectedStations.length === 1 ? "estação" : "estações"} -{" "}
                    <span className="text-green-600 capitalize">{metric}</span>
                  </p>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <defs>
                        {selectedStations.map((id, idx) => {
                          const color =
                            stationColors[idx % stationColors.length];
                          return (
                            <linearGradient
                              key={id}
                              id={`gradient-${id}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={color}
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="95%"
                                stopColor={color}
                                stopOpacity={0.03}
                              />
                            </linearGradient>
                          );
                        })}
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="timestamp"
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: "12px",
                          paddingTop: "12px",
                        }}
                        iconType="circle"
                      />

                      {selectedStations.map((id, idx) => {
                        const color = stationColors[idx % stationColors.length];
                        const stationName =
                          stationsData[id]?.nome || `Estação ${id}`;
                        return (
                          <Line
                            key={id}
                            type="monotone"
                            dataKey={`station_${id}`}
                            name={stationName}
                            stroke={color}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{
                              r: 6,
                              strokeWidth: 2,
                              stroke: "white",
                            }}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-col gap-3 m-4 pt-10">
                {(Object.keys(metricIcons) as Metric[]).map((m) => {
                  const Icon = metricIcons[m];
                  const active = metric === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setMetric(m)}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-200 shadow-sm ${
                        active
                          ? "bg-green-600 text-white shadow-md scale-105"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Listagem de estações disponíveis */}
      <div className="mt-8">
        {loadingEstacoes ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : estacoes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Nenhuma estação encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Você não possui acesso a nenhuma estação no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {estacoes.map((estacao) => {
              const isSelected = selectedStations.includes(estacao.id);
              return (
                <div
                  key={estacao.id}
                  className={`group bg-white dark:bg-gray-900 rounded-xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer ${
                    isSelected
                      ? "border-green-500 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-800"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                  onClick={() => toggleStation(estacao.id)}
                >
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition line-clamp-1">
                        {estacao.nome}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          estacao.status === "ATIVA"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : estacao.status === "INATIVA"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                        }`}
                      >
                        {estacao.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm flex-1">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{estacao.endereco}</span>
                      </div>
                      {estacao.ultima_leitura && (
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <FaThermometerHalf className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            Última temperatura:{" "}
                            {estacao.ultima_leitura.temperatura}°C
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(estacao);
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(estacao);
                          }}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      <Link
                        to={`/dashboard/${estacao.id}`}
                        className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {openMap && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 md:p-10">
          <div className="w-full h-full bg-white rounded-3xl overflow-hidden relative shadow-2xl border border-white/20">
            <button
              onClick={() => setOpenMap(false)}
              className="absolute top-6 right-6 z-[10000] bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full font-bold shadow-xl transition-transform active:scale-95"
            >
              Fechar Mapa
            </button>

            <Map
              altura="100%"
              selectedStations={selectedStations}
              onToggleEstacao={toggleStation}
            />
          </div>
        </div>
      )}

      {/* Modal de Edição/Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editando ? "Editar Estação" : "Nova Estação"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  required
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Estacao["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                >
                  <option value="ATIVA">ATIVA</option>
                  <option value="INATIVA">INATIVA</option>
                  <option value="MANUTENCAO">MANUTENÇÃO</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {submitting
                    ? "Salvando..."
                    : editando
                      ? "Atualizar"
                      : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && stationToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Confirmar exclusão
            </h2>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir a estação{" "}
              <span className="font-semibold">{stationToDelete.nome}</span>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setStationToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
