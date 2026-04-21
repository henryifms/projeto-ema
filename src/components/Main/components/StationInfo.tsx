import { FaTableList } from "react-icons/fa6";
import type { EstacaoResumo, Leitura } from "../types";
import { formatNumber } from "../utils/formatters";

interface StationInfoProps {
  estacao: EstacaoResumo;
  ultimaLeitura: Leitura | null;
}

export function StationInfo({ estacao, ultimaLeitura }: StationInfoProps) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
        <FaTableList className="text-green-600" /> Resumo rápido da estação
      </div>
      <div className="space-y-3 text-sm">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-gray-500">Endereço</p>
          <p className="mt-1 font-semibold text-gray-900">{estacao.endereco}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-gray-500">Última temperatura</p>
          <p className="mt-1 font-semibold text-gray-900">
            {formatNumber(ultimaLeitura?.temperatura)} °C
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-gray-500">Última precipitação</p>
          <p className="mt-1 font-semibold text-gray-900">
            {formatNumber(ultimaLeitura?.precipitacao)} mm
          </p>
        </div>
      </div>
    </section>
  );
}
