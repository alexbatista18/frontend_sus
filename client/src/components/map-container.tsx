import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import MapLegend from "@/components/map-legend";
import { Info, Loader2 } from "lucide-react";
import { type GeographicLevel, type Parameter, type WaterQualityData, type GeographicBoundaries } from "@shared/schema";
import "leaflet/dist/leaflet.css";

interface MapContainerProps {
  geographicLevel: GeographicLevel;
  parameter: Parameter;
  metric: string;
}

export default function MapContainer({ geographicLevel, parameter, metric }: MapContainerProps) {
  const [mapData, setMapData] = useState<Map<string, number>>(new Map());

  // Fetch water quality data
  const { data: waterData, isLoading: isLoadingWater, error: waterError } = useQuery({
    queryKey: ['/api/water-quality', { geographicLevel, parameter, metric }],
    queryFn: async () => {
      const params = new URLSearchParams({ geographicLevel, parameter, metric });
      const response = await fetch(`/api/water-quality?${params}`);
      if (!response.ok) throw new Error('Failed to fetch water quality data');
      return response.json() as Promise<WaterQualityData[]>;
    }
  });

  // Fetch geographic boundaries
  const { data: boundaries, isLoading: isLoadingBoundaries, error: boundariesError } = useQuery({
    queryKey: ['/api/geographic-boundaries', { level: geographicLevel }],
    queryFn: async () => {
      const params = new URLSearchParams({ level: geographicLevel });
      const response = await fetch(`/api/geographic-boundaries?${params}`);
      if (!response.ok) throw new Error('Failed to fetch geographic boundaries');
      return response.json() as Promise<GeographicBoundaries[]>;
    }
  });

  // Process data for map visualization
  useEffect(() => {
    if (waterData) {
      const dataMap = new Map<string, number>();
      waterData.forEach(item => {
        dataMap.set(item.regionCode, item.value);
      });
      setMapData(dataMap);
    }
  }, [waterData]);

  // Get color for choropleth based on value
  const getColor = (value: number, maxValue: number) => {
    if (maxValue === 0) return '#fee2e2';
    const intensity = value / maxValue;
    const colors = [
      '#fee2e2', '#fecaca', '#fca5a5', '#f87171', 
      '#ef4444', '#dc2626', '#b91c1c'
    ];
    const index = Math.floor(intensity * (colors.length - 1));
    return colors[index] || colors[0];
  };

  // Style function for GeoJSON layers
  const getFeatureStyle = (feature: any) => {
    const regionCode = feature.properties.code || feature.properties.name;
    const value = mapData.get(regionCode) || 0;
    const maxValue = Math.max(...Array.from(mapData.values()));
    
    return {
      fillColor: getColor(value, maxValue),
      weight: 2,
      opacity: 1,
      color: '#0D7377',
      fillOpacity: 0.7
    };
  };

  // Handle feature events
  const onEachFeature = (feature: any, layer: any) => {
    const regionCode = feature.properties.code || feature.properties.name;
    const value = mapData.get(regionCode) || 0;
    
    layer.bindTooltip(
      `<div class="p-2">
        <strong>${feature.properties.name}</strong><br/>
        Valor: ${value}
      </div>`,
      { 
        permanent: false,
        sticky: true,
        className: 'custom-tooltip'
      }
    );

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({
          weight: 3,
          color: '#FF8C42',
          fillOpacity: 0.9
        });
      },
      mouseout: (e: any) => {
        e.target.setStyle(getFeatureStyle(feature));
      }
    });
  };

  const isLoading = isLoadingWater || isLoadingBoundaries;
  const error = waterError || boundariesError;

  if (error) {
    return (
      <div className="flex-1 bg-map-bg relative flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Erro ao carregar dados do mapa</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const brazilBounds = new LatLngBounds([[-34, -74], [6, -32]]);

  return (
    <div className="flex-1 bg-map-bg relative">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-isd-teal" />
            <p className="text-gray-600">Carregando dados do mapa...</p>
          </div>
        </div>
      )}
      
      {/* Map Container */}
      <LeafletMap
        bounds={brazilBounds}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {boundaries && boundaries.map((boundary) => (
          <GeoJSON
            key={boundary.id}
            data={boundary.geojson as any}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        ))}
      </LeafletMap>
      
      {/* Map Legend */}
      <MapLegend 
        data={Array.from(mapData.values())}
        metric={metric}
      />
      
      {/* Map Info Panel */}
      <div className="absolute top-6 left-6 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-4 h-4 text-isd-teal" />
          <span className="text-sm font-medium text-gray-700">Informações</span>
        </div>
        <div className="text-sm text-gray-600">
          <p>Nível: <span className="font-medium">{geographicLevel}</span></p>
          <p>Parâmetro: <span className="font-medium">{parameter}</span></p>
        </div>
      </div>
    </div>
  );
}
