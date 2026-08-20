import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';

export interface Categoria {
  id_categoria?: number;
  nombre: string;
  descripcion: string;
}

export interface RespuestaCategoria {
  mensaje: string;
  id_categoria?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private api: ApiService) {}

  obtenerCategorias(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>('categorias');
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.api.get<Categoria>(`categorias/${id}`);
  }

  crearCategoria(
    datos: Categoria
  ): Observable<RespuestaCategoria> {
    return this.api.post<RespuestaCategoria>(
      'categorias',
      datos
    );
  }

  actualizarCategoria(
    id: number,
    datos: Categoria
  ): Observable<RespuestaCategoria> {
    return this.api.put<RespuestaCategoria>(
      `categorias/${id}`,
      datos
    );
  }

  desactivarCategoria(
    id: number
  ): Observable<RespuestaCategoria> {
    return this.api.patch<RespuestaCategoria>(
      `categorias/${id}/desactivar`,
      {}
    );
  }

  activarCategoria(
    id: number
  ): Observable<RespuestaCategoria> {
    return this.api.patch<RespuestaCategoria>(
      `categorias/${id}/activar`,
      {}
    );
  }
}