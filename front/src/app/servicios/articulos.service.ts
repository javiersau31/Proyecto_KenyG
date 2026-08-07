import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Articulo {
  id_articulo?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  existencia: number;
  id_categoria?: number;
  categoria?: string;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
  private apiUrl = 'http://localhost:3000/api/articulos';

  constructor(private http: HttpClient) {}

  getArticulos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(this.apiUrl);
  }

  getArticulo(id: number): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.apiUrl}/${id}`);
  }

  crearArticulo(articulo: Articulo): Observable<any> {
    return this.http.post(this.apiUrl, articulo);
  }

  actualizarArticulo(id: number, articulo: Articulo): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, articulo);
  }

  eliminarArticulo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('http://localhost:3000/api/categorias');
  }
}