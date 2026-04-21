import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import type { EstacaoResumo, Leitura } from "../types";
import { formatDate } from "../utils/formatters";
import { statusMap } from "../utils/constants";

interface EstacaoHeaderProps {
  estacao: EstacaoResumo;
  ultimaLeitura: Leitura | null;
  leiturasCount: number;
  equipeCount: number;
  convitesCount: number;
}

export function EstacaoHeader({
  estacao,
  ultimaLeitura,
  leiturasCount,
  equipeCount,
  convitesCount,
}: EstacaoHeaderProps) {
  return (
    <>
      <div className="px-6 pt-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <FaArrowLeft /> Voltar para todas as estações
        </Link>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusMap[estacao.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}
              >
                {estacao.status}
              </span>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-gray-700">
                Estação {estacao.id}
              </span>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-gray-700">
                Última leitura:{" "}
                <span className="font-bold">
                  {formatDate(ultimaLeitura?.data_leitura)}
                </span>
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {estacao.nome}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              O foco desta tela é a estação selecionada, com mapa primeiro,
              filtros aplicados às leituras dela e gráfico alternável por
              métrica.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-green-600">
                Leituras
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {leiturasCount}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-green-600">
                Equipe
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {equipeCount}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-green-600">
                Convites
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {convitesCount}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-green-600">
                Fonte
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                Redis + API
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
