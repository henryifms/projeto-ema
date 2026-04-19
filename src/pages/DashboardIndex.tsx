import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaThermometerHalf } from "react-icons/fa";

interface Estacao {
  id: number;
  nome: string;
  status: string;
  endereco: string;
  ultima_leitura?: {
    temperatura: number;
    data_leitura: string;
  };
}

export default function DashboardIndex() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstacoes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_BACK_URL}/estacoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEstacoes(Array.isArray(data) ? data : data.rows || []);
      } catch (error) {
        console.error("Erro ao carregar estações:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEstacoes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (estacoes.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Nenhuma estação encontrada</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Você não possui acesso a nenhuma estação no momento.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Minhas Estações</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Selecione uma estação para visualizar os detalhes e leituras.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {estacoes.map((estacao) => (
          <Link
            key={estacao.id}
            to={`/dashboard/${estacao.id}`}
            className="block group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                  {estacao.nome}
                </h2>
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

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <FaMapMarkerAlt className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{estacao.endereco}</span>
                </div>
                {estacao.ultima_leitura && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <FaThermometerHalf className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Última temperatura: {estacao.ultima_leitura.temperatura}°C</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <span className="text-xs font-medium text-green-600 dark:text-green-400 group-hover:underline">
                  Ver detalhes →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
