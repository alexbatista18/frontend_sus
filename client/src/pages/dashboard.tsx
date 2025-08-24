import React, { useState } from "react";
import Header from "@/components/header";
import MapContainer from "@/components/map-container";
import ControlPanel from "@/components/control-panel";
export default function Dashboard() {
  const [selectedLevel, setSelectedLevel] =
    useState<string>("regiao_geografica");
  const [selectedParameter, setSelectedParameter] =
    useState<string>("Turbidez (uT)");
  const [selectedMetric, setSelectedMetric] = useState<string>("");

  const handleFiltersChange = (
    level: string,
    parameter: string,
    metric: string
  ) => {
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
