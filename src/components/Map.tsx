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
  center?: [number, number];
  onSelectEstacao?: (id: string) => void;
};

const Map = ({ altura = "400px", center, onSelectEstacao }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const originalBoundsRef = useRef<L.LatLngBounds | null>(null);
  const legendDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      if (center) {
        mapInstanceRef.current.flyTo(center, 17, { duration: 1.5 });
      }
      return;
    }

    const map = L.map(mapContainerRef.current).setView(
      center || [-20.75, -51.64],
      center ? 18 : 12
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    mapInstanceRef.current = map;

    const legend = new L.Control({ position: "bottomleft" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "map-legend");

      Object.assign(div.style, {
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        minWidth: "220px",
        overflow: "hidden",
        display: "none",
        fontFamily: "system-ui, sans-serif",
        border: "1px solid #e5e7eb",
      });

      legendDivRef.current = div;
      return div;
    };

    legend.addTo(map);

    map.getContainer().addEventListener("mouseleave", () => {
      if (legendDivRef.current) legendDivRef.current.style.display = "none";

      if (originalBoundsRef.current) {
        map.flyToBounds(originalBoundsRef.current, {
          padding: [50, 50],
          duration: 1.5,
        });
      }
    });

    fetch(`${import.meta.env.VITE_BACK_URL}/estacoes`)
      .then((res) => res.json())
      .then((estacoes: any[]) => {
        const points: L.LatLngExpression[] = [];

        estacoes.forEach((estacao) => {
          const [lon, lat] = estacao.localizacao.coordinates;
          const coords: L.LatLngExpression = [lat, lon];
          points.push(coords);

          const marker = L.marker(coords).addTo(map);
          marker.bindTooltip(estacao.nome);

          marker.on("click", async () => {
            map.flyTo(coords, 18, { duration: 1.2 });

            try {
              const res = await fetch(
                `${import.meta.env.VITE_BACK_URL}/estacoes/${estacao.id}/leituras/ultima`
              );
              const leitura = await res.json();

              const prec = leitura.precipitacao ?? 0;
              const cor =
                prec > 50 ? "#ef4444" : prec > 20 ? "#f59e0b" : "#3b82f6";

              const percentual = Math.min((prec / 100) * 100, 100);

              if (legendDivRef.current) {
                legendDivRef.current.style.display = "block";

                legendDivRef.current.innerHTML = `
                  <div style="background:${cor};color:white;padding:12px;font-weight:600;font-size:14px;">
                    ${estacao.nome}
                  </div>

                  <div style="padding:12px;font-size:13px;">
                    <div style="color:#6b7280;font-weight:600;">
                      Precipitação
                    </div>

                    <div style="font-size:22px;font-weight:700;">
                      ${prec} mm
                    </div>

                    <div style="width:100%;height:8px;background:#f3f4f6;border-radius:8px;margin-top:8px;">
                      <div style="width:${percentual}%;height:100%;background:${cor};border-radius:8px;"></div>
                    </div>
                  </div>
                `;
              }
            } catch (err) {
              console.error(err);
            }

            onSelectEstacao?.(String(estacao.id));
          });
        });

        if (!center && points.length > 0) {
          const bounds = L.latLngBounds(points);
          originalBoundsRef.current = bounds;

          map.flyToBounds(bounds, {
            padding: [50, 50],
            duration: 1.5,
          });
        } else if (points.length > 0) {
          originalBoundsRef.current = L.latLngBounds(points);
        }
      });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: altura, width: "100%" }}
      className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    />
  );
};

export default Map;
