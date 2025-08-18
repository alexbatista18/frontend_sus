import { type WaterQualityData, type InsertWaterQualityData, type GeographicBoundaries, type InsertGeographicBoundaries, type WaterQualityFilters, type DataSummary } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Water Quality Data
  getWaterQualityData(filters: WaterQualityFilters): Promise<WaterQualityData[]>;
  createWaterQualityData(data: InsertWaterQualityData): Promise<WaterQualityData>;
  
  // Geographic Boundaries
  getGeographicBoundaries(level: string): Promise<GeographicBoundaries[]>;
  createGeographicBoundary(boundary: InsertGeographicBoundaries): Promise<GeographicBoundaries>;
  
  // Summary Data
  getDataSummary(): Promise<DataSummary>;
}

export class MemStorage implements IStorage {
  private waterQualityData: Map<string, WaterQualityData>;
  private geographicBoundaries: Map<string, GeographicBoundaries>;

  constructor() {
    this.waterQualityData = new Map();
    this.geographicBoundaries = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize Brazilian regions geographic data
    const regions = [
      { code: 'N', name: 'Norte', geojson: { type: 'Feature', properties: { name: 'Norte' }, geometry: { type: 'Polygon', coordinates: [[[-73.9, -2.0], [-34.0, -2.0], [-34.0, 5.3], [-73.9, 5.3], [-73.9, -2.0]]] } } },
      { code: 'NE', name: 'Nordeste', geojson: { type: 'Feature', properties: { name: 'Nordeste' }, geometry: { type: 'Polygon', coordinates: [[[-48.0, -18.0], [-34.0, -18.0], [-34.0, -2.0], [-48.0, -2.0], [-48.0, -18.0]]] } } },
      { code: 'CO', name: 'Centro-Oeste', geojson: { type: 'Feature', properties: { name: 'Centro-Oeste' }, geometry: { type: 'Polygon', coordinates: [[[-65.0, -24.0], [-46.0, -24.0], [-46.0, -7.0], [-65.0, -7.0], [-65.0, -24.0]]] } } },
      { code: 'SE', name: 'Sudeste', geojson: { type: 'Feature', properties: { name: 'Sudeste' }, geometry: { type: 'Polygon', coordinates: [[[-51.0, -25.0], [-39.0, -25.0], [-39.0, -14.0], [-51.0, -14.0], [-51.0, -25.0]]] } } },
      { code: 'S', name: 'Sul', geojson: { type: 'Feature', properties: { name: 'Sul' }, geometry: { type: 'Polygon', coordinates: [[[-57.0, -34.0], [-48.0, -34.0], [-48.0, -25.0], [-57.0, -25.0], [-57.0, -34.0]]] } } }
    ];

    regions.forEach(region => {
      const boundary: GeographicBoundaries = {
        id: randomUUID(),
        level: 'região',
        code: region.code,
        name: region.name,
        geojson: region.geojson,
        parentCode: null
      };
      this.geographicBoundaries.set(boundary.id, boundary);
    });

    // Initialize water quality data for regions
    const turbidezData = [
      { regionCode: 'N', regionName: 'Norte', metric: 'amostras_analisadas', value: 250 },
      { regionCode: 'N', regionName: 'Norte', metric: 'dados_menor_01', value: 180 },
      { regionCode: 'N', regionName: 'Norte', metric: 'dados_entre_01_03', value: 45 },
      { regionCode: 'NE', regionName: 'Nordeste', metric: 'amostras_analisadas', value: 380 },
      { regionCode: 'NE', regionName: 'Nordeste', metric: 'dados_menor_01', value: 290 },
      { regionCode: 'NE', regionName: 'Nordeste', metric: 'dados_entre_01_03', value: 65 },
      { regionCode: 'CO', regionName: 'Centro-Oeste', metric: 'amostras_analisadas', value: 120 },
      { regionCode: 'CO', regionName: 'Centro-Oeste', metric: 'dados_menor_01', value: 95 },
      { regionCode: 'CO', regionName: 'Centro-Oeste', metric: 'dados_entre_01_03', value: 18 },
      { regionCode: 'SE', regionName: 'Sudeste', metric: 'amostras_analisadas', value: 450 },
      { regionCode: 'SE', regionName: 'Sudeste', metric: 'dados_menor_01', value: 380 },
      { regionCode: 'SE', regionName: 'Sudeste', metric: 'dados_entre_01_03', value: 55 },
      { regionCode: 'S', regionName: 'Sul', metric: 'amostras_analisadas', value: 180 },
      { regionCode: 'S', regionName: 'Sul', metric: 'dados_menor_01', value: 150 },
      { regionCode: 'S', regionName: 'Sul', metric: 'dados_entre_01_03', value: 25 }
    ];

    const phData = [
      { regionCode: 'N', regionName: 'Norte', metric: 'amostras_analisadas', value: 235 },
      { regionCode: 'N', regionName: 'Norte', metric: 'dados_menor_6', value: 45 },
      { regionCode: 'NE', regionName: 'Nordeste', metric: 'amostras_analisadas', value: 365 },
      { regionCode: 'NE', regionName: 'Nordeste', metric: 'dados_menor_6', value: 78 },
      { regionCode: 'CO', regionName: 'Centro-Oeste', metric: 'amostras_analisadas', value: 115 },
      { regionCode: 'CO', regionName: 'Centro-Oeste', metric: 'dados_menor_6', value: 23 },
      { regionCode: 'SE', regionName: 'Sudeste', metric: 'amostras_analisadas', value: 435 },
      { regionCode: 'SE', regionName: 'Sudeste', metric: 'dados_menor_6', value: 89 },
      { regionCode: 'S', regionName: 'Sul', metric: 'amostras_analisadas', value: 175 },
      { regionCode: 'S', regionName: 'Sul', metric: 'dados_menor_6', value: 34 }
    ];

    // Add turbidez data
    turbidezData.forEach(data => {
      const waterData: WaterQualityData = {
        id: randomUUID(),
        geographicLevel: 'região',
        regionCode: data.regionCode,
        regionName: data.regionName,
        parameter: 'turbidez',
        metric: data.metric,
        value: data.value,
        lastUpdated: '2024-12-15'
      };
      this.waterQualityData.set(waterData.id, waterData);
    });

    // Add pH data
    phData.forEach(data => {
      const waterData: WaterQualityData = {
        id: randomUUID(),
        geographicLevel: 'região',
        regionCode: data.regionCode,
        regionName: data.regionName,
        parameter: 'ph',
        metric: data.metric,
        value: data.value,
        lastUpdated: '2024-12-15'
      };
      this.waterQualityData.set(waterData.id, waterData);
    });
  }

  async getWaterQualityData(filters: WaterQualityFilters): Promise<WaterQualityData[]> {
    return Array.from(this.waterQualityData.values()).filter(
      data => 
        data.geographicLevel === filters.geographicLevel &&
        data.parameter === filters.parameter &&
        data.metric === filters.metric
    );
  }

  async createWaterQualityData(insertData: InsertWaterQualityData): Promise<WaterQualityData> {
    const id = randomUUID();
    const data: WaterQualityData = { ...insertData, id };
    this.waterQualityData.set(id, data);
    return data;
  }

  async getGeographicBoundaries(level: string): Promise<GeographicBoundaries[]> {
    return Array.from(this.geographicBoundaries.values()).filter(
      boundary => boundary.level === level
    );
  }

  async createGeographicBoundary(insertBoundary: InsertGeographicBoundaries): Promise<GeographicBoundaries> {
    const id = randomUUID();
    const boundary: GeographicBoundaries = { 
      ...insertBoundary, 
      id,
      parentCode: insertBoundary.parentCode || null
    };
    this.geographicBoundaries.set(id, boundary);
    return boundary;
  }

  async getDataSummary(): Promise<DataSummary> {
    const totalRecords = this.waterQualityData.size;
    const uniqueRegions = new Set(Array.from(this.waterQualityData.values()).map(d => d.regionCode));
    
    return {
      totalRecords,
      lastUpdate: '15/12/2024',
      coverage: `${uniqueRegions.size} regiões`
    };
  }
}

export const storage = new MemStorage();
