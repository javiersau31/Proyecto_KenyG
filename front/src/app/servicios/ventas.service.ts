import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.services';
import { ApiResponse } from '../core/models/api-response.model';

export interface Cliente {
  id_cliente: number;
  nombre: string;
}

export interface DetalleVenta {
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface Articulo {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  precio: number;
  existencia: number;
}

@Injectable({
  providedIn: 'root',
})
export class VentasService {

  constructor(private api: ApiService) {}

  getClientes(): Observable<ApiResponse<Cliente[]>> {
    return this.api.get<Cliente[]>('ventas/clientes');
  }

  crearVenta(id_admin: number, id_cliente: number): Observable<ApiResponse<{ id_venta: number }>> {
    return this.api.post<{ id_venta: number }>('ventas', { id_admin, id_cliente });
  }

  agregarDetalle(detalle: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('ventas/detalle', detalle);
  }

  getventas(): Observable<ApiResponse<any[]>> {
    return this.api.get<any[]>('ventas/ventas');
  }

  getarticulos(): Observable<ApiResponse<Articulo[]>> {
    return this.api.get<Articulo[]>('articulos');
  }

  actualizarTotal(id_venta: number): Observable<ApiResponse<any>> {
    return this.api.put<any>(`ventas/ventas/actualizar-total/${id_venta}`, {});
  }

  getDetallesVenta(id_venta: number): Observable<ApiResponse<DetalleVenta[]>> {
    return this.api.get<DetalleVenta[]>(`ventas/detalle/${id_venta}`);
  }

  eliminarDetalle(id_detalle: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`ventas/detalle/${id_detalle}`);
  }

  editarDetalle(id_detalle: number, detalle: any): Observable<ApiResponse<any>> {
    return this.api.put<any>(`ventas/detalle/${id_detalle}`, detalle);
  }

  eliminarVenta(id_venta: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`ventas/ventas/${id_venta}`);
  }
}