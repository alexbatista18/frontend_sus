import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const waterQualityData = pgTable("water_quality_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  geographicLevel: text("geographic_level").notNull(), // 'região', 'estado', 'município'
  regionCode: text("region_code").notNull(),
  regionName: text("region_name").notNull(),
  parameter: text("parameter").notNull(), // 'turbidez', 'ph'
  metric: text("metric").notNull(),
  value: real("value").notNull(),
  lastUpdated: text("last_updated").notNull(),
});

export const geographicBoundaries = pgTable("geographic_boundaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: text("level").notNull(), // 'região', 'estado', 'município'
  code: text("code").notNull(),
  name: text("name").notNull(),
  geojson: jsonb("geojson").notNull(),
  parentCode: text("parent_code"), // for hierarchy (estado -> região, município -> estado)
});

export const insertWaterQualityDataSchema = createInsertSchema(waterQualityData).omit({
  id: true,
});

export const insertGeographicBoundariesSchema = createInsertSchema(geographicBoundaries).omit({
  id: true,
});

export type InsertWaterQualityData = z.infer<typeof insertWaterQualityDataSchema>;
export type WaterQualityData = typeof waterQualityData.$inferSelect;

export type InsertGeographicBoundaries = z.infer<typeof insertGeographicBoundariesSchema>;
export type GeographicBoundaries = typeof geographicBoundaries.$inferSelect;

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
