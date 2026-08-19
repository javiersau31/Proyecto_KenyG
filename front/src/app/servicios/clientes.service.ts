import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.services'; // <--- Cambiado a un solo nivel
import { ApiResponse } from '../core/models/api-response.model'; // <--- Cambiado a un solo nivel

export interface Cliente {
  id_cliente?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private api: ApiService) {}

  getClientes(): Observable<ApiResponse<Cliente[]>> {
    return this.api.get<Cliente[]>('clientes');
  }

  getCliente(id: number): Observable<ApiResponse<Cliente>> {
    return this.api.get<Cliente>(`clientes/${id}`);
  }

  crearCliente(cliente: Partial<Cliente>): Observable<ApiResponse<any>> {
    return this.api.post<any>('clientes', cliente);
  }

  actualizarCliente(id: number, cliente: Partial<Cliente>): Observable<ApiResponse<any>> {
    return this.api.put<any>(`clientes/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`clientes/${id}`);
  }
}