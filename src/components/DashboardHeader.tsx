import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { FaCog, FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import logoIcon from "../assets/icone.png";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const botoes = location.pathname.startsWith("/dashboard/");

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  console.log(botoes);
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 flex items-center justify-between">
      <div className="flex items-center gap-12 mr-10">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={logoIcon} alt="Logo EMA" className="w-8 h-8" />
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            EMA
          </span>
        </Link>

        {botoes && (
          <nav className="flex items-center gap-2 ml-34">
            <Link to={`/dashboard/${id}`} className="px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              Visão geral
            </Link>
            <Link to={`/dashboard/${id}/historico`} className="px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              Histórico
            </Link>
            <Link to={`/dashboard/${id}/relatorios`} className="px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              Relatórios
            </Link>
            <Link to={`/dashboard/${id}/alertas`} className="px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              Alertas
            </Link>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/conta")}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Configurações"
        >
          <FaCog className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Alternar tema"
        >
          {isDark ? (
            <FaSun className="w-4 h-4" />
          ) : (
            <FaMoon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
