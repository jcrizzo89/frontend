import { Producto } from '../../productos/models/producto.model';

export interface Categoria {
  idCategoria: string;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  activa: boolean;
  orden: number;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  
  // Relaciones
  productos?: Producto[];
  totalProductos?: number;
}

export interface CategoriaFormData extends Omit<Categoria, 
  'idCategoria' | 'fechaCreacion' | 'fechaActualizacion' | 'productos' | 'totalProductos'
> {
  // Campos adicionales específicos del formulario si son necesarios
}

export interface CategoriaStats {
  totalCategorias: number;
  categoriasActivas: number;
  productosPorCategoria: Array<{
    idCategoria: string;
    nombre: string;
    totalProductos: number;
    productosActivos: number;
  }>;
}

export interface CategoriaFilter {
  activa?: boolean;
  search?: string;
  conProductosDisponibles?: boolean;
}
