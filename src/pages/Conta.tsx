import { useState, useEffect } from "react";
import {
  FaSatellite,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface EstacaoVinculada {
  id: number;
  nome: string;
}

interface UsuarioData {
  id: number;
  nome: string;
  email: string;
  estacoes: EstacaoVinculada[];
}

const Conta = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const userStorage = localStorage.getItem("user");
        const token = localStorage.getItem("token"); // Pegamos o token aqui

        if (!userStorage || !token) {
          navigate("/login");
          return;
        }

        const userJson = JSON.parse(userStorage);
        // Ajuste aqui se o seu back usar _id ou id
        const userId = userJson.id || userJson._id;

        const res = await fetch(
          `${import.meta.env.VITE_BACK_URL}/usuarios/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ADICIONADO: Envio do token
            },
          },
        );

        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Erro ao buscar dados");

        const data = await res.json();
        const userData = Array.isArray(data) ? data[0] : data;
        setUsuario(userData);
      } catch (err) {
        console.error("Erro ao carregar conta:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, [navigate]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Carregando dados da conta...
      </div>
    );

  // Se após carregar o usuário ainda for nulo (erro na API), mostramos uma mensagem
  if (!usuario)
    return (
      <div className="p-10 text-center text-red-500">
        Erro ao carregar perfil.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARD DE INFORMAÇÕES PESSOAIS */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 text-3xl font-bold">
                {/* Corrigido com Optional Chaining (?.) para não quebrar */}
                {usuario?.nome?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {usuario?.nome}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{usuario?.email}</p>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="text-red-500 text-sm font-semibold hover:underline"
              >
                Sair da conta
              </button>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <div className="flex items-center gap-3 text-blue-700 mb-2 font-bold text-sm">
                <FaExclamationTriangle /> Status da Conta
              </div>
              <p className="text-xs text-blue-600 leading-relaxed">
                Você tem acesso a{" "}
                <b>{usuario?.estacoes?.length || 0} estações</b> monitoradas em
                tempo real.
              </p>
            </div>
          </div>

          {/* LISTA DE ESTAÇÕES */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaSatellite className="text-green-500" /> Minhas Estações
                </h3>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-medium">
                  {usuario?.estacoes?.length || 0} Total
                </span>
              </div>

              {usuario?.estacoes && usuario.estacoes.length > 0 ? (
                <div className="grid gap-4">
                  {usuario.estacoes.map((estacao) => (
                    <div
                      key={estacao.id}
                      onClick={() => navigate(`/dashboard/${estacao.id}`)}
                      className="group flex justify-between items-center p-4 bg-gray-50 hover:bg-green-50 border border-gray-100 rounded-2xl cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl text-green-600 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                          <FaSatellite />
                        </div>
                        <div>
                          <p className="font-bold text-gray-700 group-hover:text-green-700">
                            {estacao.nome}
                          </p>
                          <p className="text-xs text-gray-400 font-medium tracking-tight">
                            ID: {estacao.id}
                          </p>
                        </div>
                      </div>
                      <FaArrowRight className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-gray-400 text-sm">
                    Nenhuma estação vinculada a este perfil.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conta;
