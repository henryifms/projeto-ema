import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Cpu } from "lucide-react";

export default function UsuarioDetalhe() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACK_URL}/usuarios/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        const data = await res.json();
        const userData = Array.isArray(data) ? data[0] : data;

        setUsuario(userData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Carregando usuário...
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="p-10 text-center text-red-500">
        Erro ao carregar usuário
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* VOLTAR */}
      <button
        onClick={() => navigate("/usuarios")}
        className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* PERFIL */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600 mb-4">
            {usuario?.nome?.charAt(0).toUpperCase() || "U"}
          </div>

          <h1 className="text-xl font-bold text-gray-800">{usuario.nome}</h1>

          <p className="text-sm text-gray-500 mb-4">{usuario.email}</p>

          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-400">Estações</p>
              <p className="text-lg font-bold text-gray-800">
                {usuario.estacoes?.length || 0}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-xs text-gray-400">Status</p>
              <p className="text-lg font-bold text-green-600">Ativo</p>
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="lg:col-span-2 space-y-6">
          {/* ESTAÇÕES */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Estações vinculadas
              </h2>

              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                {usuario.estacoes?.length || 0} total
              </span>
            </div>

            {usuario.estacoes && usuario.estacoes.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {usuario.estacoes.map((estacao: any) => (
                  <div
                    key={estacao.id}
                    onClick={() => navigate(`/dashboard/${estacao.id}`)}
                    className="group border border-gray-100 p-4 rounded-2xl hover:bg-green-50 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-green-600 group-hover:text-white transition">
                        <Cpu className="w-4 h-4" />
                      </div>

                      <p className="font-semibold text-gray-700 group-hover:text-green-700">
                        {estacao.nome}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      ID: {estacao.id}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded-2xl">
                Nenhuma estação vinculada
              </div>
            )}
          </div>

          {/* FUTURO (logs, atividade etc) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Atividade recente
            </h2>

            <p className="text-sm text-gray-400">
              Logs e ações do usuário em breve...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
