import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, BarChart3, Download, HelpCircle, RefreshCw } from "lucide-react";
import { type GeographicLevel, type Parameter, type DataSummary, geographicLevels, parameters } from "@shared/schema";

interface ControlPanelProps {
  selectedLevel: GeographicLevel;
  selectedParameter: Parameter;
  selectedMetric: string;
  onFiltersChange: (level: GeographicLevel, parameter: Parameter, metric: string) => void;
}

interface MetricOption {
  value: string;
  label: string;
}

export default function ControlPanel({ selectedLevel, selectedParameter, selectedMetric, onFiltersChange }: ControlPanelProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Fetch metric options based on selected parameter
  const { data: metricOptions = [] } = useQuery({
    queryKey: ['/api/metric-options', { parameter: selectedParameter }],
    queryFn: async () => {
      const params = new URLSearchParams({ parameter: selectedParameter });
      const response = await fetch(`/api/metric-options?${params}`);
      if (!response.ok) throw new Error('Failed to fetch metric options');
      return response.json() as Promise<MetricOption[]>;
    }
  });

  // Fetch data summary
  const { data: dataSummary } = useQuery({
    queryKey: ['/api/data-summary'],
    queryFn: async () => {
      const response = await fetch('/api/data-summary');
      if (!response.ok) throw new Error('Failed to fetch data summary');
      return response.json() as Promise<DataSummary>;
    }
  });

  const handleLevelChange = (level: GeographicLevel) => {
    onFiltersChange(level, selectedParameter, selectedMetric);
  };

  const handleParameterChange = (parameter: Parameter) => {
    // Reset metric to first option when parameter changes
    const firstMetric = metricOptions[0]?.value || 'amostras_analisadas';
    onFiltersChange(selectedLevel, parameter, firstMetric);
  };

  const handleMetricChange = (metric: string) => {
    onFiltersChange(selectedLevel, selectedParameter, metric);
  };

  const handleApplyFilters = () => {
    // Force refresh by calling the handler again
    onFiltersChange(selectedLevel, selectedParameter, selectedMetric);
  };

  const getParameterLabel = (param: Parameter) => {
    return param === 'turbidez' ? 'Turbidez (uT)' : 'pH';
  };

  const getLevelLabel = (level: GeographicLevel) => {
    const labels = {
      'região': 'Região',
      'estado': 'Estado',
      'município': 'Município'
    };
    return labels[level];
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
          <p className="text-sm text-gray-600 mt-1">Configure os parâmetros de análise</p>
        </div>
        
        {/* Geographic Level Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nível Geográfico
          </label>
          <div className="grid grid-cols-1 gap-2">
            {geographicLevels.map((level) => (
              <Button
                key={level}
                onClick={() => handleLevelChange(level)}
                variant={selectedLevel === level ? "default" : "outline"}
                className={`justify-start h-12 transition-all ${
                  selectedLevel === level 
                    ? 'bg-isd-teal hover:bg-isd-teal/90 border-isd-teal text-white shadow-md' 
                    : 'border-gray-200 text-gray-700 hover:border-isd-light-teal hover:bg-gray-50'
                }`}
              >
                {getLevelLabel(level)}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Parameter Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Parâmetro
          </label>
          <Select value={selectedParameter} onValueChange={handleParameterChange}>
            <SelectTrigger className="w-full h-12 border-gray-300 focus:ring-isd-teal focus:border-isd-teal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {parameters.map((param) => (
                <SelectItem key={param} value={param}>
                  {getParameterLabel(param)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Metric Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Métrica
          </label>
          <Select value={selectedMetric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-full h-12 border-gray-300 focus:ring-isd-teal focus:border-isd-teal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Apply Filters Button */}
        <div className="mb-6">
          <Button 
            onClick={handleApplyFilters}
            className="w-full bg-isd-orange hover:bg-orange-600 text-white font-medium h-12 shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Mapa
          </Button>
        </div>
        
        {/* Data Summary */}
        {dataSummary && (
          <Card className="mb-6 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center text-gray-800">
                <BarChart3 className="w-4 h-4 mr-2" />
                Resumo dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de registros:</span>
                <span className="font-medium">{dataSummary.totalRecords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última atualização:</span>
                <span className="font-medium">{dataSummary.lastUpdate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cobertura:</span>
                <span className="font-medium">{dataSummary.coverage}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Export Options */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm hover:bg-gray-50 border-gray-200"
            >
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm hover:bg-gray-50 border-gray-200"
            >
              JSON
            </Button>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <Button
            variant="ghost"
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="w-full justify-between p-0 h-auto text-sm font-medium text-gray-700 hover:text-isd-teal"
          >
            <span className="flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" />
              Ajuda
            </span>
          </Button>
          {isHelpOpen && (
            <div className="mt-3 text-sm text-gray-600 space-y-2 bg-gray-50 p-3 rounded-md">
              <p><strong>Nível Geográfico:</strong> Escolha como visualizar os dados (por região, estado ou município).</p>
              <p><strong>Parâmetro:</strong> Selecione qual aspecto da qualidade da água analisar.</p>
              <p><strong>Métrica:</strong> Defina como os dados serão calculados e apresentados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}