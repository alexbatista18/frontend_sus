interface MapLegendProps {
  data: number[];
  metric: string;
}

export default function MapLegend({ data, metric }: MapLegendProps) {
  const minValue = Math.min(...data, 0);
  const maxValue = Math.max(...data, 100);

  const getMetricLabel = (metricValue: string) => {
    const labels: Record<string, string> = {
      'amostras_analisadas': 'Número de amostras analisadas',
      'dados_menor_01': 'Número de dados <= 0.1 uT',
      'dados_entre_01_03': 'Número de dados > 0.1 uT e <= 0.3 uT',
      'dados_menor_6': 'Número de dados < 6,0'
    };
    return labels[metricValue] || metricValue;
  };

  return (
    <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-3 text-sm">Legenda</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Menor</span>
          <span>Maior</span>
        </div>
        <div className="h-4 rounded bg-gradient-to-r from-red-100 via-red-300 via-red-400 via-red-500 to-red-700 border border-gray-200"></div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          {getMetricLabel(metric)}
        </p>
      </div>
    </div>
  );
}