import { useState } from "react";
import Header from "@/components/header";
import MapContainer from "@/components/map-container";
import ControlPanel from "@/components/control-panel";
import { type GeographicLevel, type Parameter } from "@shared/schema";

export default function Dashboard() {
  const [selectedLevel, setSelectedLevel] = useState<GeographicLevel>('região');
  const [selectedParameter, setSelectedParameter] = useState<Parameter>('turbidez');
  const [selectedMetric, setSelectedMetric] = useState<string>('amostras_analisadas');

  const handleFiltersChange = (level: GeographicLevel, parameter: Parameter, metric: string) => {
    setSelectedLevel(level);
    setSelectedParameter(parameter);
    setSelectedMetric(metric);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <MapContainer 
          geographicLevel={selectedLevel}
          parameter={selectedParameter}
          metric={selectedMetric}
        />
        <ControlPanel
          selectedLevel={selectedLevel}
          selectedParameter={selectedParameter}
          selectedMetric={selectedMetric}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </div>
  );
}
