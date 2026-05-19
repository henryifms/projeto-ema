import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// páginas
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import Conta from "./pages/Conta.tsx";
import ConfirmEmail from "./pages/ConfirmEmail.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Estacoes from "./pages/Estacoes.tsx";
import UsuarioDetalhe from "./pages/UsuarioDetalhe";
import Usuarios from "./pages/Usuarios.tsx";
import DocsPage from "./pages/DocsPage.tsx";
import DashboardIndex from "./pages/DashboardIndex";
import Sobre from "./pages/Sobre";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorio";
import Alertas from "./pages/Alertas";

// layout
import Layout from "./components/Layout.tsx";
import DashboardHeader from "./components/DashboardHeader.tsx";

const PrivateRoute = ({ children }: any) => {
  const isAuth = !!localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/login" />;
};

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <DashboardHeader />

      <Layout>
        <Outlet />
      </Layout>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLICO */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/sobre" element={<Sobre />} />

        {/* PRIVADO */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
                <DashboardHeader />
                <Layout>
                  <DashboardIndex />
                </Layout>
              </div>
            </PrivateRoute>
          }
        />

        <Route
  path="/dashboard/:id"
  element={
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="historico" element={<Historico />} />
  <Route path="relatorios" element={<Relatorios />} />
  <Route path="alertas" element={<Alertas />} />
</Route>
        <Route
          path="/estacoes"
          element={
            <PrivateRoute>
              <Layout>
                <Estacoes />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* LISTA DE USUÁRIOS */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Layout>
                <Usuarios />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* DETALHE DO USUÁRIO */}
        <Route
          path="/usuarios/:id"
          element={
            <PrivateRoute>
              <Layout>
                <UsuarioDetalhe />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/conta"
          element={
            <PrivateRoute>
              <Layout>
                <Conta />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
