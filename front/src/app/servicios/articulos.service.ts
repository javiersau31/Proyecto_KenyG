import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';

export interface Articulo {
  id_articulo?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  existencia: number;
  id_categoria: number;
  categoria?: string;
}

export interface RespuestaArticulo {
  mensaje: string;
  id_articulo?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  constructor(private api: ApiService) {}

  obtenerArticulos(): Observable<Articulo[]> {
    return this.api.get<Articulo[]>('articulos');
  }

  obtenerArticuloPorId(id: number): Observable<Articulo> {
    return this.api.get<Articulo>(`articulos/${id}`);
  }

  crearArticulo(datos: Articulo): Observable<RespuestaArticulo> {
    return this.api.post<RespuestaArticulo>('articulos', datos);
  }

  actualizarArticulo(
    id: number,
    datos: Articulo
  ): Observable<RespuestaArticulo> {
    return this.api.put<RespuestaArticulo>(
      `articulos/${id}`,
      datos
    );
  }

  desactivarArticulo(id: number): Observable<RespuestaArticulo> {
    return this.api.patch<RespuestaArticulo>(
      `articulos/${id}/desactivar`,
      {}
    );
  }

  activarArticulo(id: number): Observable<RespuestaArticulo> {
    return this.api.patch<RespuestaArticulo>(
      `articulos/${id}/activar`,
      {}
    );
  }
}