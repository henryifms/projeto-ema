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
      <div className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      </div>

      <div className="">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <Map
            altura="500px"
            center={[
              estacao.localizacao.coordinates[1],
              estacao.localizacao.coordinates[0],
            ]}
          />
        </div>
      </div>
    </section>
  );
}
