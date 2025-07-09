import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Producto, 
  ProductoFormData, 
  ProductoFiltro, 
  ProductoStats, 
  MovimientoInventario, 
  AjusteInventario 
} from '../models/producto.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos con filtros opcionales
   */
  getAll(filters?: ProductoFiltro): Observable<{ productos: Producto[], total: number }> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }
    
    return this.http.get<{ productos: Producto[], total: number }>(this.apiUrl, { params });
  }

  /**
   * Obtiene un producto por su ID
   */
  getById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo producto
   */
  create(producto: ProductoFormData): Observable<Producto> {
    const formData = this.createFormData(producto);
    return this.http.post<Producto>(this.apiUrl, formData);
  }

  /**
   * Actualiza un producto existente
   */
  update(id: string, producto: Partial<ProductoFormData>): Observable<Producto> {
    const formData = this.createFormData(producto);
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Elimina un producto
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza el estado de un producto (activo/inactivo)
   */
  updateEstado(id: string, activo: boolean): Observable<Producto> {
    return this.http.patch<Producto>(
      `${this.apiUrl}/${id}/estado`,
      { activo }
    );
  }

  /**
   * Actualiza el stock de un producto
   */
  updateStock(id: string, cantidad: number, motivo: string, notas?: string): Observable<Producto> {
    return this.http.patch<Producto>(
      `${this.apiUrl}/${id}/stock`,
      { cantidad, motivo, notas }
    );
  }

  /**
   * Obtiene el historial de movimientos de inventario de un producto
   */
  getMovimientosInventario(id: string, params?: {
    fechaInicio?: Date;
    fechaFin?: Date;
    tipo?: string;
    pagina?: number;
    porPagina?: number;
  }): Observable<{ movimientos: MovimientoInventario[], total: number }> {
    let queryParams = new HttpParams();
    
    if (params) {
      if (params.fechaInicio) queryParams = queryParams.append('fechaInicio', params.fechaInicio.toISOString());
      if (params.fechaFin) queryParams = queryParams.append('fechaFin', params.fechaFin.toISOString());
      if (params.tipo) queryParams = queryParams.append('tipo', params.tipo);
      if (params.pagina) queryParams = queryParams.append('pagina', params.pagina.toString());
      if (params.porPagina) queryParams = queryParams.append('porPagina', params.porPagina.toString());
    }
    
    return this.http.get<{ movimientos: MovimientoInventario[], total: number }>(
      `${this.apiUrl}/${id}/movimientos`,
      { params: queryParams }
    );
  }

  /**
   * Obtiene estadísticas de productos
   */
  getEstadisticas(): Observable<ProductoStats> {
    return this.http.get<ProductoStats>(`${this.apiUrl}/estadisticas`);
  }

  /**
   * Realiza un ajuste de inventario
   */
  ajustarInventario(ajuste: AjusteInventario): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/ajustar-inventario`, ajuste);
  }

  /**
   * Exporta productos a Excel
   */
  exportToExcel(filters?: ProductoFiltro): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }
    
    return this.http.get(`${this.apiUrl}/exportar`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Importa productos desde un archivo Excel
   */
  importFromExcel(file: File): Observable<{ total: number, exitosos: number, errores: any[] }> {
    const formData = new FormData();
    formData.append('archivo', file);
    
    return this.http.post<{ total: number, exitosos: number, errores: any[] }>(
      `${this.apiUrl}/importar`,
      formData
    );
  }

  /**
   * Crea un FormData a partir de los datos del producto
   */
  private createFormData(producto: Partial<ProductoFormData>): FormData {
    const formData = new FormData();
    
    Object.entries(producto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Manejo especial para arrays de imágenes
        if (key === 'imagenes' && Array.isArray(value)) {
          value.forEach((imagen, index) => {
            if (imagen instanceof File) {
              formData.append(`imagenes[${index}]`, imagen, imagen.name);
            } else if (typeof imagen === 'string') {
              formData.append(`imagenesUrls[${index}]`, imagen);
            }
          });
        } 
        // Manejo especial para imágenes eliminadas
        else if (key === 'imagenesEliminadas' && Array.isArray(value)) {
          value.forEach((id, index) => {
            formData.append(`imagenesEliminadas[${index}]`, id);
          });
        }
        // Manejo de archivos
        else if (value instanceof File) {
          formData.append(key, value, value.name);
        } 
        // Manejo de fechas
        else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } 
        // Manejo de objetos y arrays (se convierten a JSON)
        else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } 
        // Manejo de valores primitivos
        else {
          formData.append(key, value.toString());
        }
      }
    });
    
    return formData;
  }
}
