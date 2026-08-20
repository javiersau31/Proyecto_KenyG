import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';

export interface Venta {
  id_venta: number;
  fecha: string;
  total: number;
  id_cliente?: number;
  nombre_cliente: string;
}

export interface DetalleVenta {
  id_detalle: number;
  id_articulo: number;
  nombre_articulo: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CrearVenta {
  id_cliente: number;
}

export interface AgregarDetalle {
  id_venta: number;
  id_articulo: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private api: ApiService) {}

  // =========================
  // VENTAS
  // =========================

  obtenerVentas(): Observable<Venta[]> {
    return this.api.get<Venta[]>('ventas');
  }

  obtenerVentaPorId(id: number): Observable<Venta> {
    return this.api.get<Venta>(`ventas/${id}`);
  }

  crearVenta(datos: CrearVenta): Observable<any> {
    return this.api.post('ventas', datos);
  }

  eliminarVenta(id: number): Observable<any> {
    return this.api.delete(`ventas/${id}`);
  }

  // =========================
  // DETALLE DE VENTA
  // =========================

  obtenerDetalles(idVenta: number): Observable<DetalleVenta[]> {
    return this.api.get<DetalleVenta[]>(
      `ventas/${idVenta}/detalle`
    );
  }

  agregarDetalle(datos: AgregarDetalle): Observable<any> {
    return this.api.post('ventas/detalle', datos);
  }

  editarDetalle(
    idDetalle: number,
    cantidad: number,
  ): Observable<any> {

    return this.api.put(
      `ventas/detalle/${idDetalle}`,
      {
        cantidad
      }
    );
  }

  eliminarDetalle(idDetalle: number): Observable<any> {
    return this.api.delete(
      `ventas/detalle/${idDetalle}`
    );
  }

  actualizarTotal(idVenta: number): Observable<any> {
    return this.api.put(
      `ventas/${idVenta}/actualizar-total`,
      {}
    );
  }
}