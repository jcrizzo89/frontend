import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaFormData, CategoriaStats, CategoriaFilter } from '../models/categoria.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las categorías con filtros opcionales
   */
  getAll(filters?: CategoriaFilter): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl, { params: filters as any });
  }

  /**
   * Obtiene una categoría por su ID
   */
  getById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  create(categoria: CategoriaFormData): Observable<Categoria> {
    const formData = this.createFormData(categoria);
    return this.http.post<Categoria>(this.apiUrl, formData);
  }

  /**
   * Actualiza una categoría existente
   */
  update(id: string, categoria: Partial<CategoriaFormData>): Observable<Categoria> {
    const formData = this.createFormData(categoria);
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Elimina una categoría
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza el estado de una categoría (activa/inactiva)
   */
  updateEstado(id: string, activa: boolean): Observable<Categoria> {
    return this.http.patch<Categoria>(
      `${this.apiUrl}/${id}/estado`,
      { activa }
    );
  }

  /**
   * Obtiene estadísticas de las categorías
   */
  getEstadisticas(): Observable<CategoriaStats> {
    return this.http.get<CategoriaStats>(`${this.apiUrl}/estadisticas`);
  }

  /**
   * Verifica si un nombre de categoría ya existe
   */
  checkNombreDisponible(nombre: string, idCategoriaExcluida?: string): Observable<{ disponible: boolean }> {
    const params: any = { nombre };
    if (idCategoriaExcluida) {
      params.excluir = idCategoriaExcluida;
    }
    return this.http.get<{ disponible: boolean }>(`${this.apiUrl}/check-nombre`, { params });
  }

  /**
   * Reordena las categorías
   */
  reordenar(idsOrdenados: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reordenar`, { ids: idsOrdenados });
  }

  /**
   * Crea un FormData a partir de los datos de la categoría
   */
  private createFormData(categoria: Partial<CategoriaFormData>): FormData {
    const formData = new FormData();
    
    Object.entries(categoria).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'imagen' && value instanceof File) {
          formData.append('imagen', value, value.name);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    return formData;
  }
}
