import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaChartLine,
  FaMapMarkedAlt,
  FaUsers,
  FaBell,
} from "react-icons/fa";
import type { ReactNode } from "react";

interface MenuItem {
  name: string;
  path: string;
  icon: React.JSX.Element;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaChartLine className="w-4 h-4" />,
  },
  {
    name: "Estações",
    path: "/estacoes",
    icon: <FaMapMarkedAlt className="w-4 h-4" />,
  },
  {
    name: "Usuários",
    path: "/usuarios",
    icon: <FaUsers className="w-4 h-4" />,
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex flex-1 min-h-0 bg-gray-50 dark:bg-gray-950">
      <aside className="w-50 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" &&
                location.pathname.startsWith("/dashboard"));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="fixed bottom-2 left-5 flex flex-col gap-2 justify-center border-t border-gray-300 pt-2">
          <Link
            to="/conta"
            className=" w-40 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <FaBell className="w-5 h-5 text-green-600" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                Notificações
              </p>
            </div>
          </Link>
          <Link
            to="/conta"
            className=" w-40 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <FaUserCircle className="w-5 h-5 text-green-600" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {user?.nome || "Usuário"}
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-8xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
