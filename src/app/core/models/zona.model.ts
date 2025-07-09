/**
 * Interfaz que representa una zona geográfica en el sistema
 */
export interface Zona {
  /** Identificador único de la zona */
  idZona: number;
  
  /** Nombre descriptivo de la zona */
  zona: string;
  
  /** Descripción opcional de la zona */
  descripcion?: string;
  
  /** Fecha de creación del registro */
  createdAt?: Date;
  
  /** Fecha de la última actualización */
  updatedAt?: Date;
}

/**
 * Tipo para la creación de una nueva zona (omite el idZona que es generado por el servidor)
 */
export type NuevaZona = Omit<Zona, 'idZona' | 'createdAt' | 'updatedAt'>;

/**
 * Tipo para actualizar una zona existente (todos los campos opcionales excepto idZona)
 */
export type ActualizarZona = Partial<Omit<Zona, 'idZona'>> & { idZona: number };
