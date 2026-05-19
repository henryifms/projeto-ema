import { useState, useEffect } from "react";
import {
  Trash2,
  Edit3,
  Plus,
  MapPin,
  Clock,
  Calendar,
  User,
  Users,
  AlertCircle,
  ArrowRight,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatarData(dataString: string) {
  return new Date(dataString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarCoordenadas(loc: any) {
  if (!loc?.coordinates) return "Não disponível";
  const [lng, lat] = loc.coordinates;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

interface EquipeMembro {
  id: number;
  nome: string;
  email: string;
  usuarios_estacoes: { papel: string };
}

interface Estacao {
  id: number;
  nome: string;
  endereco: string;
  status: "INATIVA" | "MANUTENCAO" | "ATIVA";
  api_key: string;
  usuario_proprietario_id: number;
  criado_em: string;
  atualizado_em: string;
  leituras: Array<{ id: string }>;
  proprietario: {
    id: number;
    nome: string;
    email: string;
  };
  equipe: EquipeMembro[];
  localizacao?: {
    type: string;
    coordinates: [number, number];
  };
}

export default function Estacoes() {
  const navigate = useNavigate();
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editando, setEditando] = useState<Estacao | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    status: "INATIVA" as Estacao["status"],
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token") || "";

  const fetchEstacoes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEstacoes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstacoes();
  }, []);

  const ativaCount = estacoes.filter((e) => e.status === "ATIVA").length;
  const total = estacoes.length;
  const totalLeituras = estacoes.reduce((sum, e) => sum + e.leituras.length, 0);

  const getStatusConfig = (status: Estacao["status"]) => {
    switch (status) {
      case "ATIVA":
        return {
          color: "text-green-700 dark:text-green-300",
          bg: "bg-green-100 dark:bg-green-900/40",
          icon: AlertCircle,
          label: "ATIVA",
        };
      case "MANUTENCAO":
        return {
          color: "text-sky-700 dark:text-sky-300",
          bg: "bg-sky-100 dark:bg-sky-900/40",
          icon: Settings,
          label: "MANUTENÇÃO",
        };
      case "INATIVA":
      default:
        return {
          color: " text-amber-700 dark:text-amber-300",
          bg: "bg-amber-100 dark:bg-amber-900/40",
          icon: Clock,
          label: "INATIVA",
        };
    }
  };

  const openModal = (estacao?: Estacao) => {
    if (estacao) {
      setEditando(estacao);
      setFormData({
        nome: estacao.nome,
        endereco: estacao.endereco,
        status: estacao.status,
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

    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta estação?")) return;

    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEstacoes();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Dashboard de Estações
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm">
            <Clock className="w-4 h-4" /> {total} estações
          </div>
          <div className="flex items-center gap-1 text-sm px-4 py-2 rounded-xl backdrop-blur-sm bg-green-100 text-green-800">
            <AlertCircle className="w-4 h-4" /> {ativaCount} ativas
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

      {/* Cards de Estações */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {estacoes.map((estacao) => {
            const statusConfig = getStatusConfig(estacao.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={estacao.id}
                onClick={() => navigate(`/dashboard/${estacao.id}`)}
                className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 border border-gray-100 hover:border-green-200 rounded-3xl shadow-sm hover:shadow-2xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Header com Status */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all ${statusConfig.bg} ${statusConfig.color.replace("text-", "text-")}`}
                    >
                      <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors">
                        {estacao.nome}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="px-2 py-1 bg-white/60 rounded-full text-xs font-medium">
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-green-500 group-hover:translate-x-2 transition-all duration-300" />
                </div>

                {/* Endereço e Coordenadas */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 leading-relaxed line-clamp-2">
                      {estacao.endereco}
                    </p>
                  </div>
                  {estacao.localizacao && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
                      {formatarCoordenadas(estacao.localizacao)}
                    </div>
                  )}
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50/50 rounded-xl group-hover:bg-white/50 transition-all">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600 mb-1">
                      {estacao.leituras.length}
                    </div>
                    <div className="text-xs text-gray-500">leituras</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50/50 rounded-xl group-hover:bg-white/50 transition-all">
                    <div className="text-sm font-semibold text-gray-900">
                      {estacao.equipe.length}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" /> equipe
                    </div>
                  </div>
                </div>

                {/* Proprietário e Datas */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">Proprietário:</span>
                    <span className="text-gray-600">
                      {estacao.proprietario.nome}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Criada: {formatarData(estacao.criado_em)}
                    </div>
                    <div>Atualiz.: {formatarData(estacao.atualizado_em)}</div>
                  </div>
                </div>

                {/* Ações (aparecem no hover) */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pt-4 border-t border-gray-100">
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      openModal(estacao);
                    }}
                    className="p-3 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-2xl transition-all flex-1 text-center"
                    title="Editar"
                  >
                    <Edit3 className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDelete(estacao.id);
                    }}
                    className="p-3 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-2xl transition-all flex-1 text-center"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="col-span-full py-24 text-center text-gray-500 text-lg">
            Carregando estações...
          </div>
        )}
        {estacoes.length === 0 && !loading && (
          <div className="col-span-full py-24 text-center text-gray-500">
            Nenhuma estação cadastrada. Crie a primeira!
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                {editando ? "Editar Estação" : "Nova Estação"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nome da Estação *
                  </label>
                  <input
                    required
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="Ex: Estação IFMS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Endereço Completo
                  </label>
                  <input
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({ ...formData, endereco: e.target.value })
                    }
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    placeholder="Rua, número, bairro, cidade, estado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {(["INATIVA", "MANUTENCAO", "ATIVA"] as const).map(
                      (status) => {
                        const config = getStatusConfig(status);
                        const StatusIcon = config.icon;
                        return (
                          <label key={status} className="cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value={status}
                              checked={formData.status === status}
                              onChange={() =>
                                setFormData({ ...formData, status })
                              }
                              className="sr-only peer"
                            />
                            <div
                              className={`p-4 rounded-2xl border-2 transition-all peer-checked:border-blue-500 peer-checked:shadow-md peer-checked:shadow-blue-100 peer-checked:bg-blue-50 ${config.bg}`}
                            >
                              <StatusIcon
                                className={`w-6 h-6 mx-auto mb-2 ${config.color}`}
                              />
                              <div className="text-sm font-medium text-gray-800">
                                {config.label}
                              </div>
                            </div>
                          </label>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading
                    ? "Salvando..."
                    : editando
                      ? "Atualizar Estação"
                      : "Criar Estação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
