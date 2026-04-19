import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaChartLine, FaMapMarkedAlt, FaUsers, FaCog, FaSun, FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import logoIcon from "../assets/icone.png";

interface MenuItem {
  name: string;
  path: string;
  icon: React.JSX.Element;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: <FaChartLine className="w-4 h-4" /> },
  { name: "Estações", path: "/estacoes", icon: <FaMapMarkedAlt className="w-4 h-4" /> },
  { name: "Usuários", path: "/usuarios", icon: <FaUsers className="w-4 h-4" /> },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

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

  const toggleTheme = () => setIsDark(!isDark);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <img src={logoIcon} alt="Logo EMA" className="w-6 h-6" />
            </div>
            {/* Título EMA com contraste garantido no modo escuro */}
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-gray-800 dark:text-white">EMA</span>
            </h1>
          </Link>

          <div className="relative">
            <Link
              to="/conta"
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition group"
            >
              <FaUserCircle className="w-10 h-10 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {user?.nome || "Usuário"}
                </p>
                </div>
            </Link>
            <button
              onClick={handleLogout}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              title="Sair"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path === "/dashboard" && location.pathname.startsWith("/dashboard/"));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 shadow-sm border border-green-100 dark:border-green-800"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className={isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 mt-auto space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
          >
            {isDark ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            {isDark ? "Modo claro" : "Modo escuro"}
          </button>

          <Link
            to="/conta"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              location.pathname === "/conta"
                ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 shadow-sm border border-green-100 dark:border-green-800"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
            }`}
          >
            <FaCog className="w-4 h-4" />
            Minha conta
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
