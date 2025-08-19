import { z } from "zod";

// Frontend-specific types
export const geographicLevels = ['região', 'estado', 'município'] as const;
export const parameters = ['turbidez', 'ph'] as const;

export const turbidezMetrics = [
  'amostras_analisadas',
  'dados_menor_01',
  'dados_entre_01_03'
] as const;

export const phMetrics = [
  'amostras_analisadas',
  'dados_menor_6'
] as const;

export type GeographicLevel = typeof geographicLevels[number];
export type Parameter = typeof parameters[number];
export type TurbidezMetric = typeof turbidezMetrics[number];
export type PhMetric = typeof phMetrics[number];

export interface WaterQualityData {
  id: string;
  geographicLevel: GeographicLevel;
  regionCode: string;
  regionName: string;
  parameter: Parameter;
  metric: string;
  value: number;
  lastUpdated: string;
}

export interface GeographicBoundaries {
  id: string;
  level: string;
  code: string;
  name: string;
  geojson: any;
  parentCode: string | null;
}

export interface InsertWaterQualityData {
  geographicLevel: GeographicLevel;
  regionCode: string;
  regionName: string;
  parameter: Parameter;
  metric: string;
  value: number;
  lastUpdated: string;
}

export interface InsertGeographicBoundaries {
  level: string;
  code: string;
  name: string;
  geojson: any;
  parentCode?: string | null;
}

export interface WaterQualityFilters {
  geographicLevel: GeographicLevel;
  parameter: Parameter;
  metric: string;
}

export interface DataSummary {
  totalRecords: number;
  lastUpdate: string;
  coverage: string;
}
