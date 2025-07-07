// src/app/dashboard/models/zona.model.ts

export interface Zona {
  id?: string; // ← idZona en backend
  zona: string;
  descripcion?: string;
  activa: boolean;
  barrios: string[];
}
