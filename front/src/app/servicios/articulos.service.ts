import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.services';
import { ApiResponse } from '../core/models/api-response.model';

export interface Articulo {
  id_articulo?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  existencia: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
  constructor(private api: ApiService) {}

  getArticulos(): Observable<ApiResponse<Articulo[]>> {
    return this.api.get<Articulo[]>('articulos');
  }

  getArticulo(id: number): Observable<ApiResponse<Articulo>> {
    return this.api.get<Articulo>(`articulos/${id}`);
  }

  crearArticulo(articulo: Articulo): Observable<ApiResponse<any>> {
    return this.api.post<any>('articulos', articulo);
  }

  actualizarArticulo(id: number, articulo: Articulo): Observable<ApiResponse<any>> {
    return this.api.put<any>(`articulos/${id}`, articulo);
  }

  eliminarArticulo(id: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`articulos/${id}`);
  }
}