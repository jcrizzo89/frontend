import { Categoria } from '../../categorias/models/categoria.model';

export interface Producto {
  idProducto: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  costo?: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
  destacado: boolean;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  
  // Relaciones
  idCategoria: string;
  categoria?: Categoria;
  
  // Imágenes
  imagenes?: ProductoImagen[];
  
  // Atributos adicionales
  atributos?: ProductoAtributo[];
  
  // Estadísticas
  totalVendidos?: number;
  ultimoPrecioCompra?: number;
  fechaUltimaCompra?: Date;
}

export interface ProductoImagen {
  idImagen: string;
  url: string;
  orden: number;
  esPrincipal: boolean;
}

export interface ProductoAtributo {
  idAtributo: string;
  nombre: string;
  valor: string;
  tipo: 'texto' | 'numero' | 'booleano' | 'seleccion';
  opciones?: string[];
  requerido: boolean;
}

export interface ProductoFormData extends Omit<Producto, 
  'idProducto' | 'fechaCreacion' | 'fechaActualizacion' | 'categoria' | 'imagenes' | 'atributos' | 'totalVendidos' | 'ultimoPrecioCompra' | 'fechaUltimaCompra'
> {
  imagenes?: (File | string)[]; // File para nuevas imágenes, string para URLs existentes
  imagenesEliminadas?: string[]; // IDs de imágenes a eliminar
  atributos?: Omit<ProductoAtributo, 'idAtributo'>[];
}

export interface ProductoFiltro {
  buscar?: string;
  idCategoria?: string;
  soloActivos?: boolean;
  soloDestacados?: boolean;
  conStockBajo?: boolean;
  rangoPrecioMin?: number;
  rangoPrecioMax?: number;
  ordenarPor?: 'nombre' | 'precio' | 'stock' | 'fechaCreacion';
  orden?: 'asc' | 'desc';
  pagina?: number;
  porPagina?: number;
}

export interface ProductoStats {
  totalProductos: number;
  productosActivos: number;
  productosSinStock: number;
  productosStockBajo: number;
  valorTotalInventario: number;
  productosPorCategoria: Array<{
    idCategoria: string;
    nombre: string;
    total: number;
  }>;
  productosMasVendidos: Array<{
    idProducto: string;
    nombre: string;
    cantidadVendida: number;
    totalVendido: number;
  }>;
}

export interface MovimientoInventario {
  idMovimiento: string;
  fecha: Date;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  motivo: string;
  idUsuario: string;
  usuario?: {
    nombre: string;
    email: string;
  };
  idPedido?: string;
  notas?: string;
}

export interface AjusteInventario {
  idProducto: string;
  cantidad: number;
  motivo: string;
  notas?: string;
}
