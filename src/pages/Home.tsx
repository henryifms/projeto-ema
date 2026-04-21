import { useState } from "react";
import { Link } from "react-router-dom";
import HourlyForecast from "../components/HourlyForecast";
import type { DadoPrevisao } from "../components/HourlyForecast";
import { FaGithub, FaTimes } from "react-icons/fa";
import logoIcon from "../assets/icone.png";
import Map from "../components/Map";
import PlanoPesquisa from "../components/PlanoPesquisa";

const Home = () => {
  const [openPDF, setOpenPDF] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [dadosPrevisao, setDadosPrevisao] = useState<DadoPrevisao[]>([]);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<string | null>(
    null,
  );

  return (
    <div className="flex font-sans">
      <div
        className={`bg-white text-gray-800 min-h-screen transition-all duration-300 ${
          openPDF ? "w-1/2" : "w-full"
        }`}
      >
        {/* HEADER */}
        <header className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <img src={logoIcon} alt="Logo EMA" className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-gray-800">EMA</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/henryifms/projeto-ema"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-green-600 transition"
            >
              <FaGithub size={22} />
            </a>
            <Link
              to="/docs"
              className="text-gray-700 hover:text-green-600 transition"
            >
              Documentação
            </Link>
            <Link
              to="/sobre"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              Sobre
            </Link>
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Entrar
            </Link>
          </div>
        </header>

        <section className="py-16 px-6 bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Monitoramento meteorológico inteligente
              </h2>
              <p className="text-gray-600 mb-6">
                Crie sua conta gratuitamente e acompanhe dados climáticos em
                tempo real.
              </p>
            </div>
          </div>
        </section>

        {/* MAPA */}
        <section className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-2xl font-semibold text-green-600">
              Estações em tempo real
            </h3>
            <button
              onClick={() => setOpenMap(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition underline decoration-2 underline-offset-4"
            >
              Ampliar Mapa
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative group">
            <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-xs font-bold text-gray-600">
                Clique para expandir
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative z-0">
              <Map altura="500px" onSelectEstacao={setEstacaoSelecionada} />
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-start gap-4 mt-10">
            <HourlyForecast
              dadosPrevisao={dadosPrevisao}
              setDadosPrevisao={setDadosPrevisao}
              loading={loadingForecast}
              setLoading={setLoadingForecast}
              estacaoIdExterna={estacaoSelecionada}
            />
          </div>
        </section>

        <footer className="text-center text-sm text-gray-400 p-10">
          © 2026 Projeto EMA
        </footer>
      </div>

      {/* MODAL DO MAPA (Versão Limpa) */}
      {openMap && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 md:p-10">
          <div className="w-full h-full bg-white rounded-3xl overflow-hidden relative shadow-2xl border border-white/20">
            <button
              onClick={() => setOpenMap(false)}
              className="absolute top-6 right-6 z-[10000] bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full font-bold shadow-xl transition-transform active:scale-95"
            >
              Fechar Mapa
            </button>
            <Map altura="100%" onSelectEstacao={setEstacaoSelecionada} />
          </div>
        </div>
      )}

      {/* BARRA LATERAL DO PDF */}
      {openPDF && (
        <div className="w-1/2 h-screen border-l overflow-hidden sticky top-0 relative bg-white">
          {/* Botão X para fechar o PDF */}
          <button
            onClick={() => setOpenPDF(false)}
            className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition"
            aria-label="Fechar plano de pesquisa"
          >
            <FaTimes size={20} />
          </button>
          <PlanoPesquisa />
        </div>
      )}
    </div>
  );
};

export default Home;
