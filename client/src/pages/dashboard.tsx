import React, { useState } from "react";
import Header from "@/components/header";
import MapContainer from "@/components/map-container";
import ControlPanel from "@/components/control-panel";
export default function Dashboard() {
  // Iniciar com Estado (uf)
  const [selectedLevel, setSelectedLevel] = useState<string>("uf");
  // Sempre iniciar com a primeira métrica do parâmetro inicial
  const dadosFiltros: Record<string, string[]> = {
    "Bactérias Heterotróficas (UFC/mL)": [
      "Número de amostras analisadas",
      "Número de resultados < 500 UFC/mL",
      "Número de resultados > 500 UFC/mL",
    ],
    "Cloro Residual Combinado (mg/L)": [
      "Número de amostras analisadas",
      "Número de dados < 2,0 mg/L",
      "Número de dados >= 2,0 mg/L e <= 4,0 mg/L",
      "Número de dados > 4,0 mg/L",
      "Percentil 95",
    ],
    "Cloro Residual Livre (mg/L)": [
      "Número de amostras analisadas",
      "Número de dados < 0,2 mg/L",
      "Número de dados >= 0,2 mg/L e <= 2,0mg/L",
      "Número de dados > 2,0 mg/L e <= 5,0mg/L",
      "Número de dados >= 2,0 mg/L e <= 5,0mg/L",
      "Número de dados > 5,0 mg/L",
      "Percentil 95",
    ],
    "Coliformes totais": [
      "N de amostras com ausência de coliformes totais",
      "N de amostras com presença de coliformes totais",
      "Número de amostras analisadas",
    ],
    "Cor (uH)": [
      "Número de amostras analisadas",
      "Número de dados <= 15,0 uH",
      "Número de dados > 15,0 uH",
      "Percentil 95",
    ],
    "Dióxido de Cloro": [
      "Número de amostras analisadas",
      "Número de dados < 0,2 mg/L",
      "Número de dados >= 0,2 mg/L e <= 1,0 mg/L",
      "Número de dados > 1,0 mg/L",
      "Percentil 95",
    ],
    "Escherichia coli": [
      "N de amostras com ausência para Escherichia coli",
      "N de amostras com presença para Escherichia coli",
      "Número de amostras analisadas",
    ],
    "Fluoreto (mg/L)": [
      "Média das temperaturas máximas diárias(°C)",
      "Número de amostras analisadas",
      "Número de dados <",
      "Número de dados >",
      "Número de dados >=",
      "Número de dados <= 1,5 mg/L",
      "Número de dados > 1,5 mg/L",
      "Percentil 95",
    ],
    pH: [
      "Número de amostras analisadas",
      "Número de dados < 6,0",
      "Número de dados >= 6,0 e <= 9,0",
      "Número de dados > 9,0",
    ],
    "Turbidez (uT)": [
      "Número de amostras analisadas",
      "Número de dados <= 0.1 uT",
      "Número de dados > 0.1 uT e <= 0.3 uT",
      "Número de dados <= 0,3 uT",
      "Número de dados > 0.3 uT",
      "Número de dados > 0,3 uT e <= 0,5 uT",
      "Número de dados > 0.3 uT e <= 1.0 uT",
      "Número de dados > 0,5 uT e <= 1,0 uT",
      "Número de dados <= 1.0 uT",
      "Número de dados > 1,0 uT",
      "Número de dados > 1.0 uT e <= 0.5 uT",
      "Número de dados > 1.0 uT e <= 2.0 uT",
      "Número de dados > 2.0 uT",
      "Número de dados <= 5,0 uT",
      "Número de dados > 5,0 uT",
      "Percentil 95",
    ],
  };
  const initialParameter = "Turbidez (uT)";
  const initialMetric = dadosFiltros[initialParameter][0] || "";
  const [selectedParameter, setSelectedParameter] = useState<string>(initialParameter);
  const [selectedMetric, setSelectedMetric] = useState<string>(initialMetric);

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
