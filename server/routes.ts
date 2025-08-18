import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { geographicLevels, parameters, type WaterQualityFilters } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Water quality data endpoint
  app.get("/api/water-quality", async (req, res) => {
    try {
      const filtersSchema = z.object({
        geographicLevel: z.enum(geographicLevels),
        parameter: z.enum(parameters),
        metric: z.string()
      });

      const filters = filtersSchema.parse(req.query) as WaterQualityFilters;
      const data = await storage.getWaterQualityData(filters);
      
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: "Invalid filters provided" });
    }
  });

  // Geographic boundaries endpoint
  app.get("/api/geographic-boundaries", async (req, res) => {
    try {
      const level = req.query.level as string;
      if (!level || !geographicLevels.includes(level as any)) {
        return res.status(400).json({ error: "Invalid geographic level" });
      }

      const boundaries = await storage.getGeographicBoundaries(level);
      res.json(boundaries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch geographic boundaries" });
    }
  });

  // Data summary endpoint
  app.get("/api/data-summary", async (req, res) => {
    try {
      const summary = await storage.getDataSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data summary" });
    }
  });

  // Metric options endpoint
  app.get("/api/metric-options", async (req, res) => {
    try {
      const parameter = req.query.parameter as string;
      
      let metrics: { value: string; label: string }[] = [];
      
      if (parameter === 'turbidez') {
        metrics = [
          { value: 'amostras_analisadas', label: 'Número de amostras analisadas' },
          { value: 'dados_menor_01', label: 'Número de dados <= 0.1 uT' },
          { value: 'dados_entre_01_03', label: 'Número de dados > 0.1 uT e <= 0.3 uT' }
        ];
      } else if (parameter === 'ph') {
        metrics = [
          { value: 'amostras_analisadas', label: 'Número de amostras analisadas' },
          { value: 'dados_menor_6', label: 'Número de dados < 6,0' }
        ];
      }
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metric options" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
