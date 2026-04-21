import { FaSatellite, FaMagnifyingGlass, FaLocationDot } from "react-icons/fa6";
import Map from "../../Map";
import type { EstacaoResumo } from "../types";
import type { NearestStationInfo } from "../types";

interface MapSectionProps {
  estacao: EstacaoResumo;
  todasEstacoes: EstacaoResumo[];
  selectedStations: number[];
  onStationToggle: (stationId: number) => void;
  onFindNearest: () => void;
  nearestInfo: NearestStationInfo | null;
}

export function MapSection({
  estacao,
  todasEstacoes,
  selectedStations,
  onStationToggle,
  onFindNearest,
  nearestInfo,
}: MapSectionProps) {
  return (
    <section className="rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            <FaSatellite /> mapa da estação
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            Mapa e busca de estação
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Busque a estação mais próxima e selecione pontos para comparação
            diretamente na área principal.
          </p>
        </div>
        <button
          onClick={onFindNearest}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <FaMagnifyingGlass /> Buscar estação mais próxima
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <Map
            altura="500px"
            center={[
              estacao.localizacao.coordinates[1],
              estacao.localizacao.coordinates[0],
            ]}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <FaLocationDot className="text-green-600" /> Comparar estações
            </div>
            <div className="max-h-[270px] space-y-2 overflow-y-auto pr-1">
              {todasEstacoes.map((station) => (
                <label
                  key={station.id}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
                    selectedStations.includes(station.id)
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <p className="truncate font-semibold text-gray-900">
                      {station.nome}
                    </p>
                    <p className="text-xs text-gray-500">ID {station.id}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedStations.includes(station.id)}
                    onChange={() => onStationToggle(station.id)}
                    disabled={station.id === estacao.id}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-700 to-green-800 p-4 text-white shadow-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <FaLocationDot className="text-green-300" /> Resultado da busca
            </div>
            {nearestInfo ? (
              <div className="mt-3 space-y-2 text-sm text-green-100">
                <p className="text-base font-semibold text-white">
                  {nearestInfo.nome || nearestInfo.estacao?.nome || "Resultado"}
                </p>
                <p>
                  {nearestInfo.endereco ||
                    nearestInfo.estacao?.endereco ||
                    "Sem endereço disponível"}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-green-100">
                Clique em buscar para carregar a estação mais próxima com base
                na estação que você está analisando.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
