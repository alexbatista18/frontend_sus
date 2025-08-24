import { useEffect, useState } from "react";
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
  // Carregar GeoJSON de regiões (mock)
  useEffect(() => {
    if (geographicLevel === "regiao_geografica") {
      fetch("/geojson/mock_regioes.geojson")
        .then((res) => res.json())
        .then(setGeoJson)
        .catch(() => setGeoJson(null));
    } else {
      setGeoJson(null); // futuro: carregar outros níveis
    }
  }, [geographicLevel]);
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
        console.log("Dados recebidos da API:", res.data);
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
        {geoJson && (
          <GeoJSON
            data={geoJson}
            style={(feature) => {
              const code = feature?.properties?.regiao_geografica;
              const dado = apiData.find((d) => d.regiao_geografica === code);
              return {
                fillColor: getColor(dado?.valor ?? 0, min, max),
                weight: 2,
                opacity: 1,
                color: "#333",
                fillOpacity: 0.7,
              };
            }}
            onEachFeature={(feature, layer) => {
              const code = feature?.properties?.regiao_geografica;
              const dado = apiData.find((d) => d.regiao_geografica === code);
              layer.bindTooltip(
                `<strong>${feature?.properties?.name}</strong><br/>Valor: ${
                  dado?.valor ?? "N/A"
                }`,
                { sticky: true }
              );
            }}
          />
        )}
      </LeafletMap>
    </div>
  );
}
