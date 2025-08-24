import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import { useCallback } from "react";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapContainerProps {
  geographicLevel: string;
  parameter: string;
  metric: string;
}

export default function MapContainer({
  geographicLevel,
  parameter,
  metric,
}: MapContainerProps) {
  const brazilBounds = new LatLngBounds([
    [-34, -74],
    [6, -32],
  ]);

  const [apiData, setApiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoJson, setGeoJson] = useState<any>(null);
  // Ref para o GeoJSON
  const geoJsonRef = useRef<any>(null);
  // Carregar GeoJSON conforme o nível selecionado
  useEffect(() => {
    if (geographicLevel === "uf") {
      fetch("/geojson/geojson_estados.json")
        .then((res) => res.json())
        .then((data) => {
          setGeoJson(data);
        })
        .catch((err) => {
          console.error("Erro ao carregar GeoJSON dos estados:", err);
          setGeoJson(null);
        });
    } else {
      setGeoJson(null); // Não desenha quadrados de regiões
    }
  }, [geographicLevel]);

  // Atualizar tooltips quando apiData mudar
  useEffect(() => {
    if (!geoJsonRef.current) return;
    const layerGroup = geoJsonRef.current;
    if (!layerGroup || !layerGroup.getLayers) return;
    layerGroup.getLayers().forEach((layer: any) => {
      const feature = layer.feature;
      const code = (feature?.id || "").toUpperCase();
      const dado = apiData.find((d) => (d.uf || "").toUpperCase() === code);
      let valor = "N/A";
      if (
        dado &&
        dado.valor !== undefined &&
        dado.valor !== null &&
        dado.valor !== ""
      ) {
        const num = Number(dado.valor);
        valor = isNaN(num)
          ? dado.valor
          : num.toLocaleString(undefined, { maximumFractionDigits: 2 });
      }
      let nome = feature?.properties?.name;
      layer.unbindTooltip();
      layer.bindTooltip(`<strong>${nome}</strong><br/>Valor: ${valor}`, {
        sticky: true,
      });
    });
  }, [apiData, geoJson]);

  // Função para colorir regiões
  const getColor = useCallback((valor: number, min: number, max: number) => {
    if (isNaN(valor)) return "#ccc";
    // Escala simples: verde (baixo) a vermelho (alto)
    const percent = (valor - min) / (max - min || 1);
    const r = Math.round(255 * percent);
    const g = Math.round(200 * (1 - percent));
    return `rgb(${r},${g},100)`;
  }, []);

  // Encontrar min/max
  const valores = apiData.map((d) => d.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);

  useEffect(() => {
    if (!geographicLevel || !parameter || !metric) return;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      nivel: geographicLevel,
      parametro: parameter,
      campo_monitoramento: metric,
    });
    axios
      .get(`https://api.innovadta.com.br/api/analise?${params}`)
      .then((res) => {
        setApiData(res.data);
        // Debug: mostrar dados no console
        //console.log("Dados recebidos da API:", res.data);
      })
      .catch((err) => {
        setError("Erro ao buscar dados da API");
        setApiData([]);
      })
      .finally(() => setLoading(false));
  }, [geographicLevel, parameter, metric]);

  return (
    <div className="flex-1 bg-map-bg relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
          <span className="text-gray-700">Carregando dados...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
          <span className="text-red-600">{error}</span>
        </div>
      )}
      <LeafletMap
        bounds={brazilBounds}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJson && geoJson.features && geoJson.features.length > 0 && (
          <GeoJSON
            ref={geoJsonRef}
            data={geoJson}
            style={(feature: any) => {
              const code = (feature?.id || "").toUpperCase();
              const dado = apiData.find(
                (d) => (d.uf || "").toUpperCase() === code
              );
              const valor = Number(dado?.valor ?? NaN);
              let color = "#ccc";
              if (!isNaN(valor) && max > min) {
                const percent = (valor - min) / (max - min);
                if (percent <= 0.5) {
                  // Verde (0,200,80) até Amarelo (255,255,80)
                  const p = percent * 2;
                  const r = Math.round(0 + (255 - 0) * p);
                  const g = Math.round(200 + (255 - 200) * p);
                  color = `rgb(${r},${g},80)`;
                } else {
                  // Amarelo (255,255,80) até Vermelho (255,0,80)
                  const p = (percent - 0.5) * 2;
                  const r = 255;
                  const g = Math.round(255 - 255 * p);
                  color = `rgb(${r},${g},80)`;
                }
              }
              return {
                fillColor: color,
                weight: 2,
                opacity: 1,
                color: "#333",
                fillOpacity: 0.7,
              };
            }}
            onEachFeature={(feature: any, layer: any) => {
              const code = (feature?.id || "").toUpperCase();
              const dado = apiData.find(
                (d) => (d.uf || "").toUpperCase() === code
              );
              let valor = "N/A";
              if (
                dado &&
                dado.valor !== undefined &&
                dado.valor !== null &&
                dado.valor !== ""
              ) {
                const num = Number(dado.valor);
                valor = isNaN(num)
                  ? dado.valor
                  : num.toLocaleString(undefined, { maximumFractionDigits: 2 });
              }
              let nome = feature?.properties?.name;
              layer.bindTooltip(
                `<strong>${nome}</strong><br/>Valor: ${valor}`,
                { sticky: true }
              );
            }}
          />
        )}
      </LeafletMap>
      {/* Legenda do mapa de calor */}
      {apiData.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 8,
            padding: 12,
            boxShadow: "0 2px 8px #0002",
            zIndex: 1000,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Legenda</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 24,
                height: 12,
                background: `rgb(0,255,80)`,
                display: "inline-block",
                border: "1px solid #ccc",
              }}
            ></span>
            <span style={{ fontSize: 12 }}>
              {min.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
              (mín)
            </span>
            <span
              style={{
                width: 48,
                height: 12,
                background: `linear-gradient(to right, rgb(0,255,80), rgb(255,255,80), rgb(255,0,80))`,
                display: "inline-block",
                border: "1px solid #ccc",
              }}
            ></span>
            <span style={{ fontSize: 12 }}>
              {max.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
              (máx)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
