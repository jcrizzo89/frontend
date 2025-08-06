import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente, UbicacionCliente, Llamada } from '../models/client.model';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los clientes
   * @returns Observable con la lista de clientes
   */
  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Obtiene un cliente por su ID
   * @param id ID del cliente a obtener
   * @returns Observable con los datos del cliente
   */
  getById(id: string): Observable<Cliente> {
    if (!id) {
      return throwError(() => new Error('ID de cliente no proporcionado'));
    }
    
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Obtiene las direcciones guardadas de un cliente
   * @param clientId ID del cliente
   * @returns Observable con la lista de direcciones del cliente
   */
  getClientAddresses(clientId: string): Observable<UbicacionCliente[]> {
    if (!clientId) {
      return throwError(() => new Error('ID de cliente no proporcionado'));
    }
    
    return this.http.get<Cliente>(`${this.apiUrl}/${clientId}`, httpOptions).pipe(
      map((cliente: Cliente) => {
        // Asegurarse de que las ubicaciones tengan un ID
        return (cliente.ubicaciones || []).map((ubicacion, index) => ({
          ...ubicacion,
          // Si no tiene ID, generamos uno temporal basado en el índice
          idUbicacion: ubicacion.idUbicacion || `temp-${index}`,
          // Asegurarnos de que la descripción tenga un valor por defecto si está vacía
          descripcion: ubicacion.descripcion || `Domicilio ${index + 1}`
        }));
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Crea un nuevo cliente
   * @param clienteData Datos del cliente a crear
   * @returns Observable con el cliente creado
   */
  create(clienteData: Omit<Cliente, 'idCliente'>): Observable<Cliente> {
    try {
      // Formatear los datos según lo que espera el backend
      const clienteToSend: any = {
        nombre: clienteData.nombre,
        telefono: `+54${clienteData.codigoArea}${clienteData.telefono}`, // Combinar código de área y teléfono
        idZona: clienteData.idZona,
        observaciones: clienteData.observaciones || '',
        alerta: clienteData.alerta || false
      };

      // Si hay ubicaciones, las agregamos al objeto a enviar
      if (clienteData.ubicaciones && clienteData.ubicaciones.length > 0) {
        clienteToSend.ubicaciones = clienteData.ubicaciones.map(ubicacion => ({
          descripcion: ubicacion.descripcion,
          latitud: ubicacion.latitud,
          longitud: ubicacion.longitud,
          linkMaps: ubicacion.linkMaps || '',
          activa: ubicacion.activa !== false // Por defecto true si no está definido
        }));
      }
      
      console.log('Enviando datos al servidor:', JSON.stringify(clienteToSend, null, 2));
      
      return this.http.post<Cliente>(this.apiUrl, clienteToSend, httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('Error en la petición de creación de cliente:', {
              status: error.status,
              statusText: error.statusText,
              url: error.url,
              error: error.error,
              message: error.message
            });
            return this.handleError(error);
          })
        );
    } catch (error) {
      console.error('Error al preparar los datos del cliente:', error);
      return throwError(() => ({
        status: 0,
        message: 'Error en el cliente',
        details: 'Error al preparar los datos del cliente',
        originalError: error
      }));
    }
  }

  /**
   * Actualiza un cliente existente
   * @param id ID del cliente a actualizar
   * @param clienteData Datos actualizados del cliente
   * @returns Observable con el cliente actualizado
   */
  update(id: string, clienteData: Partial<Cliente>): Observable<Cliente> {
    if (!id) {
      return throwError(() => new Error('ID de cliente no proporcionado'));
    }
    
    try {
      // Formatear los datos según lo que espera el backend
      const clienteToSend: any = {
        nombre: clienteData.nombre,
        telefono: clienteData.codigoArea && clienteData.telefono 
          ? `+54${clienteData.codigoArea}${clienteData.telefono}`
          : clienteData.telefono, // Si ya tiene el formato correcto
        idZona: clienteData.idZona,
        observaciones: clienteData.observaciones,
        alerta: clienteData.alerta
      };

      // Si hay ubicaciones, las agregamos al objeto a enviar
      if (clienteData.ubicaciones && clienteData.ubicaciones.length > 0) {
        clienteToSend.ubicaciones = clienteData.ubicaciones.map(ubicacion => ({
          idUbicacion: ubicacion.idUbicacion, // Incluimos el ID para actualización
          descripcion: ubicacion.descripcion,
          latitud: ubicacion.latitud,
          longitud: ubicacion.longitud,
          linkMaps: ubicacion.linkMaps || '',
          activa: ubicacion.activa !== false // Por defecto true si no está definido
        }));
      }
      
      console.log(`Actualizando cliente ${id} con datos:`, clienteToSend);
      
      return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, clienteToSend, httpOptions)
        .pipe(
          catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    } catch (error) {
      console.error(`Error al preparar los datos del cliente ${id}:`, error);
      return throwError(() => new Error('Error al preparar los datos del cliente'));
    }
  }

  /**
   * Elimina un cliente
   * @param id ID del cliente a eliminar
   * @returns Observable que se completa cuando la operación es exitosa
   */
  delete(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('ID de cliente no proporcionado'));
    }
    
    console.log(`Eliminando cliente con ID: ${id}`);
    
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`, 
      httpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Procesa el campo fIngreso para asegurar que sea un string de fecha ISO válido
   * @param cliente Objeto cliente a procesar
   */
  private processFechaIngreso(cliente: { fIngreso?: Date | string | null }): void {
    try {
      let date: Date;
      
      if (cliente.fIngreso) {
        // Si es string, intentar convertirlo a Date
        if (typeof cliente.fIngreso === 'string') {
          date = new Date(cliente.fIngreso);
          if (isNaN(date.getTime())) {
            console.warn('Fecha inválida, usando fecha actual');
            date = new Date();
          }
        } 
        // Si ya es un objeto Date, validarlo
        else if (cliente.fIngreso instanceof Date) {
          date = isNaN(cliente.fIngreso.getTime()) ? new Date() : cliente.fIngreso;
        }
        // Si no es ni string ni Date, usar fecha actual
        else {
          console.warn('Tipo de fecha no soportado, usando fecha actual');
          date = new Date();
        }
      } else {
        // Si no hay fecha, usar la actual
        date = new Date();
      }
      
      // Convertir a string ISO para el backend
      const isoString = date.toISOString();
      
      // Asignar el string ISO al cliente
      cliente.fIngreso = isoString;
      
      // Log para depuración
      console.log('Fecha procesada:', {
        original: date,
        isoString: isoString,
        type: 'string',
        isIso: true
      });
      
    } catch (e) {
      console.error('Error al procesar la fecha fIngreso:', e);
      // En caso de error, usar la fecha actual en formato ISO
      cliente.fIngreso = new Date().toISOString();
    }
  }

  /**
   * Maneja los errores de las peticiones HTTP
   * @param error Error de la petición
   * @returns Observable que emite un error
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición HTTP:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error,
      headers: error.headers,
      message: error.message,
      name: error.name,
      ok: error.ok,
      type: error.type
    });
    
    if (error.status === 0) {
      // Error de conexión
      return throwError(() => ({
        status: 0,
        message: 'Error de conexión',
        details: 'No se pudo conectar al servidor. Verifique su conexión a internet.',
        originalError: error
      }));
    } else if (error.status === 400) {
      // Error de validación del lado del servidor
      return throwError(() => ({
        status: error.status,
        message: 'Datos inválidos',
        details: error.error?.message || error.message,
        errors: error.error?.errors || {},
        originalError: error.error
      }));
    } else if (error.status === 401 || error.status === 403) {
      // No autorizado o prohibido
      return throwError(() => ({
        status: error.status,
        message: 'No autorizado',
        details: error.error?.message || 'No tiene permisos para realizar esta acción',
        originalError: error.error
      }));
    } else if (error.status === 404) {
      // Recurso no encontrado
      return throwError(() => ({
        status: error.status,
        message: 'Recurso no encontrado',
        details: error.error?.message || 'El recurso solicitado no existe',
        originalError: error.error
      }));
    } else if (error.status >= 500) {
      // Error del servidor
      return throwError(() => ({
        status: error.status,
        message: 'Error del servidor',
        details: error.error?.message || 'Ocurrió un error en el servidor. Por favor, intente nuevamente más tarde.',
        serverError: error.error,
        originalError: error
      }));
    }
    
    // Cualquier otro error
    return throwError(() => ({
      status: error.status || 0,
      message: 'Error desconocido',
      details: error.message || 'Ocurrió un error inesperado.',
      originalError: error
    }));
  }

  /**
   * Obtiene las ubicaciones de un cliente
   * @param clienteId ID del cliente
   * @returns Observable con la lista de ubicaciones
   */
  getUbicaciones(clienteId: string): Observable<UbicacionCliente[]> {
    if (!clienteId) {
      return throwError(() => new Error('ID de cliente no proporcionado'));
    }
    
    return this.http.get<UbicacionCliente[]>(`${this.apiUrl}/${clienteId}/ubicaciones`, httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  /**
   * Agrega una nueva ubicación a un cliente
   * @param clienteId ID del cliente
   * @param ubicacion Datos de la ubicación a agregar
   * @returns Observable con la ubicación creada
   */
  addUbicacion(clienteId: string, ubicacion: Omit<UbicacionCliente, 'idUbicacion' | 'idCliente'>): Observable<UbicacionCliente> {
    if (!clienteId) {
      return throwError(() => new Error('ID de cliente no proporcionado'));
    }
    
    return this.http.post<UbicacionCliente>(
      `${this.apiUrl}/${clienteId}/ubicaciones`, 
      ubicacion,
      httpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Actualiza una ubicación de un cliente
   * @param clienteId ID del cliente
   * @param ubicacionId ID de la ubicación a actualizar
   * @param ubicacion Datos actualizados de la ubicación
   * @returns Observable con la ubicación actualizada
   */
  updateUbicacion(
    clienteId: string, 
    ubicacionId: string, 
    ubicacion: Partial<UbicacionCliente>
  ): Observable<UbicacionCliente> {
    if (!clienteId || !ubicacionId) {
      return throwError(() => new Error('ID de cliente o ubicación no proporcionado'));
    }
    
    return this.http.put<UbicacionCliente>(
      `${this.apiUrl}/${clienteId}/ubicaciones/${ubicacionId}`, 
      ubicacion,
      httpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Elimina una ubicación de un cliente
   * @param clienteId ID del cliente
   * @param ubicacionId ID de la ubicación a eliminar
   * @returns Observable vacío que se completa cuando la operación es exitosa
   */
  deleteUbicacion(clienteId: string, ubicacionId: string): Observable<void> {
    if (!clienteId || !ubicacionId) {
      return throwError(() => new Error('ID de cliente o ubicación no proporcionado'));
    }
    
    return this.http.delete<void>(
      `${this.apiUrl}/${clienteId}/ubicaciones/${ubicacionId}`,
      httpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Obtiene el historial de llamadas de un cliente
   * @param clienteId ID del cliente
   * @returns Observable con la lista de llamadas del cliente
   */
  getLlamadas(clienteId: string): Observable<Llamada[]> {
    if (!clienteId) {
      return throwError(() => new Error('ID de cliente no proporcionado'));
    }
    
    return this.http.get<Llamada[]>(
      `${this.apiUrl}/${clienteId}/llamadas`,
      httpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Registra una nueva llamada para un cliente
   * @param clienteId ID del cliente
   * @param llamada Datos de la llamada a registrar
   * @returns Observable con la llamada registrada
   */
  addLlamada(clienteId: string, llamada: Omit<Llamada, 'idLlamada' | 'idCliente'>): Observable<Llamada> {
    if (!clienteId) {
      return throwError(() => new Error('ID de cliente no proporcionado'));
    }
    
    return this.http.post<Llamada>(
      `${this.apiUrl}/${clienteId}/llamadas`,
      llamada,
      httpOptions
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
}
