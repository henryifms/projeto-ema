import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

type MapProps = {
  altura?: string;
  largura?: string;
  center?: [number, number];

  // 🔥 DASHBOARD MODE
  selectedStations?: number[];
  onToggleEstacao?: (id: number) => void;

  // 🔥 HOME MODE
  onSelectEstacao?: (id: string) => void;
};

export default function Map({
  altura = "400px",
  largura = "100%",
  center,
  selectedStations,
  onToggleEstacao,
  onSelectEstacao,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const originalBoundsRef = useRef<L.LatLngBounds | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);

  const isDashboard = !!selectedStations;

  useEffect(() => {
    if (!containerRef.current) return;

    // 🔥 CRIA MAPA UMA VEZ
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(
        center || [-20.75, -51.64],
        center ? 17 : 12,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current,
      );

      layerRef.current = L.layerGroup().addTo(mapRef.current);

      if (!isDashboard) {
        const legend = new L.Control({ position: "bottomleft" });

        legend.onAdd = () => {
          const div = L.DomUtil.create("div");

          Object.assign(div.style, {
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            minWidth: "240px",
            overflow: "hidden",
            display: "none",
            border: "1px solid #e2e8f0",
            fontFamily: "system-ui, sans-serif",
            backdropFilter: "blur(6px)",
          });

          legendRef.current = div;
          return div;
        };

        legend.addTo(mapRef.current);

        mapRef.current.getContainer().addEventListener("mouseleave", () => {
          if (legendRef.current) legendRef.current.style.display = "none";

          if (originalBoundsRef.current) {
            mapRef.current!.flyToBounds(originalBoundsRef.current, {
              padding: [50, 50],
              duration: 1.5,
            });
          }
        });
      }
    }

    // 🔥 BUSCA ESTAÇÕES
    fetch(`${import.meta.env.VITE_BACK_URL}/estacoes`)
      .then((r) => r.json())
      .then((estacoes: any[]) => {
        if (!layerRef.current || !mapRef.current) return;

        layerRef.current.clearLayers();

        const points: L.LatLngExpression[] = [];
        const selectedPoints: L.LatLngExpression[] = [];

        estacoes.forEach((estacao) => {
          const [lon, lat] = estacao.localizacao.coordinates;
          const coords: L.LatLngExpression = [lat, lon];

          points.push(coords);

          const isSelected = selectedStations?.includes(estacao.id);

          if (isSelected) selectedPoints.push(coords);

          const marker = L.marker(coords).addTo(layerRef.current!);
          marker.bindTooltip(estacao.nome);

          marker.on("click", async () => {
            // 🔥 DASHBOARD MODE
            if (isDashboard) {
              onToggleEstacao?.(estacao.id);
              return;
            }

            // 🔥 HOME MODE
            mapRef.current!.flyTo(coords, 18, { duration: 1.2 });

            try {
              const res = await fetch(
                `${import.meta.env.VITE_BACK_URL}/estacoes/${estacao.id}/leituras/ultima`,
              );
              const leitura = await res.json();

              const prec = leitura.precipitacao ?? 0;
              const cor =
                prec > 50 ? "#ef4444" : prec > 20 ? "#f59e0b" : "#3b82f6";

              if (legendRef.current) {
                legendRef.current.style.display = "block";

                legendRef.current.innerHTML = `
  <div style="
    padding:14px 16px;
    background:${cor};
    color:white;
    font-weight:600;
    font-size:14px;
    letter-spacing:0.3px;
  ">
    ${estacao.nome}
  </div>

  <div style="
    padding:16px;
    display:flex;
    flex-direction:column;
    gap:6px;
  ">
    <span style="
      font-size:11px;
      text-transform:uppercase;
      color:#64748b;
      font-weight:600;
      letter-spacing:0.6px;
    ">
      Precipitação
    </span>

    <span style="
      font-size:26px;
      font-weight:700;
      color:#0f172a;
      line-height:1;
    ">
      ${prec} mm
    </span>

    <div style="
      width:100%;
      height:6px;
      background:#f1f5f9;
      border-radius:999px;
      overflow:hidden;
      margin-top:6px;
    ">
      <div style="
        width:${Math.min((prec / 100) * 100, 100)}%;
        height:100%;
        background:${cor};
        border-radius:999px;
      "></div>
    </div>
  </div>
`;
              }
            } catch {}

            onSelectEstacao?.(String(estacao.id));
          });

          // 🔥 CÍRCULO DASHBOARD
          if (isDashboard && isSelected) {
            L.circle(coords, {
              radius: 200,
              color: "#22c55e",
              fillColor: "#22c55e",
              fillOpacity: 0.15,
              weight: 2,
            }).addTo(layerRef.current!);
          }
        });

        // 🔥 FIT BOUNDS INTELIGENTE

        // DASHBOARD → foco nas selecionadas
        if (isDashboard && selectedPoints.length > 0) {
          const bounds = L.latLngBounds(selectedPoints);
          mapRef.current.flyToBounds(bounds, {
            padding: [80, 80],
            duration: 1.2,
          });
          return;
        }

        // HOME ou fallback → todas
        if (points.length > 0) {
          const bounds = L.latLngBounds(points);
          originalBoundsRef.current = bounds;

          mapRef.current.flyToBounds(bounds, {
            padding: [50, 50],
            duration: 1.5,
          });
        }
      });
  }, [selectedStations, center]);

  return (
    <div
      ref={containerRef}
      style={{ height: altura, width: largura }}
      className="rounded-2xl border border-gray-200 overflow-hidden"
    />
  );
}
