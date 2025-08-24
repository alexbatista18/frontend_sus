import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, HelpCircle } from "lucide-react";

interface ControlPanelProps {
  selectedLevel: string;
  selectedParameter: string;
  selectedMetric: string;
  onFiltersChange: (level: string, parameter: string, metric: string) => void;
}

// Objeto de filtros conforme briefing
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

export default function ControlPanel({
  selectedLevel,
  selectedParameter,
  selectedMetric,
  onFiltersChange,
}: ControlPanelProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const geographicLevels = [
    { value: "regiao_geografica", label: "Região" },
    { value: "uf", label: "Estado" },
    { value: "municipio", label: "Município" },
  ];
  const parametros = Object.keys(dadosFiltros);
  const metricas = dadosFiltros[selectedParameter] || [];

  const handleLevelChange = (level: string) => {
    onFiltersChange(level, selectedParameter, selectedMetric);
  };

  const handleParameterChange = (parameter: string) => {
    const firstMetric =
      (dadosFiltros[parameter] && dadosFiltros[parameter][0]) || "";
    onFiltersChange(selectedLevel, parameter, firstMetric);
  };

  const handleMetricChange = (metric: string) => {
    onFiltersChange(selectedLevel, selectedParameter, metric);
  };

  return (
    <div className="w-1/4 bg-white border-l border-gray-200 overflow-y-auto shadow-lg">
      <div className="p-6">
        {/* Panel Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 text-isd-orange mr-2" />
            Filtros de Visualização
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure os parâmetros de análise
          </p>
        </div>

        {/* Geographic Level Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nível Geográfico
          </label>
          <div className="grid grid-cols-1 gap-2">
            {geographicLevels.map((level) => (
              <Button
                key={level.value}
                onClick={() => handleLevelChange(level.value)}
                variant={selectedLevel === level.value ? "default" : "outline"}
                className={`justify-start h-12 transition-all ${
                  selectedLevel === level.value
                    ? "bg-isd-teal hover:bg-isd-teal/90 border-isd-teal text-white shadow-md"
                    : "border-gray-200 text-gray-700 hover:border-isd-light-teal hover:bg-gray-50"
                }`}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Parameter Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Parâmetro
          </label>
          <Select
            value={selectedParameter}
            onValueChange={handleParameterChange}
          >
            <SelectTrigger className="w-full h-12 border-gray-300 focus:ring-isd-teal focus:border-isd-teal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {parametros.map((param) => (
                <SelectItem key={param} value={param}>
                  {param}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Métrica Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Métrica
          </label>
          <Select value={selectedMetric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-full h-12 border-gray-300 focus:ring-isd-teal focus:border-isd-teal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metricas.map((metrica) => (
                <SelectItem key={metrica} value={metrica}>
                  {metrica}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Apply Filters Button e Export/Resumo removidos para evitar erros. */}
        <span
          className="flex items-center mt-4 cursor-pointer select-none"
          onClick={() => setIsHelpOpen((v) => !v)}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Ajuda
        </span>
        {isHelpOpen && (
          <div className="mt-3 text-sm text-gray-600 space-y-2 bg-gray-50 p-3 rounded-md">
            <p>
              <strong>Nível Geográfico:</strong> Escolha como visualizar os
              dados (por região, estado ou município).
            </p>
            <p>
              <strong>Parâmetro:</strong> Selecione qual aspecto da qualidade da
              água analisar.
            </p>
            <p>
              <strong>Métrica:</strong> Defina como os dados serão calculados e
              apresentados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
