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
    </>
  );
}
