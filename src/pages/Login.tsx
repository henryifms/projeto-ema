import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setAlert({ message: "Email ou senha inválidos", type: "error" });
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const resEstacoes = await fetch(
        `${import.meta.env.VITE_BACK_URL}/estacoes`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const dataEstacoes = await resEstacoes.json();

      const lista = Array.isArray(dataEstacoes)
        ? dataEstacoes
        : dataEstacoes.data || [];

      if (lista.length > 0) {
        const id = lista[0]._id || lista[0].id;

        if (id) {
          localStorage.setItem("estacaoId", id);
          navigate(`/dashboard/${id}`);
        } else {
          setAlert({ message: "Erro: estação sem ID", type: "error" });
        }
      } else {
        setAlert({ message: "Nenhuma estação encontrada", type: "error" });
      }
    } catch {
      setAlert({ message: "Erro ao fazer login", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-blue-50 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-600 tracking-tight">
            EMA
          </h1>
          <p className="text-sm text-gray-500">Monitoramento Meteorológico</p>
        </div>


        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-lg bg-green-50 border border-gray-200 text-gray-700 placeholder-gray-400 outline-none focus:border-green-500"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 p-3 pr-10 rounded-lg bg-blue-50 border border-gray-200 text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>
          </div>

          {alert && <Alerta message={alert.message} type={alert.type} />}
          <p className="text-sm text-gray-500 text-center">
            Ainda não tem conta?{" "}
            <Link
              to="/cadastro"
              className="text-blue-500 font-medium hover:underline"
            >
              Cadastrar
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
