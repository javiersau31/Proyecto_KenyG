import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';

export interface Cliente {
  id_cliente?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}

export interface RespuestaCliente {
  mensaje: string;
  id_cliente?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private api: ApiService) {}

  obtenerClientes(): Observable<Cliente[]> {
    return this.api.get<Cliente[]>('clientes');
  }

  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.api.get<Cliente>(`clientes/${id}`);
  }

  crearCliente(
    datos: Cliente
  ): Observable<RespuestaCliente> {
    return this.api.post<RespuestaCliente>(
      'clientes',
      datos
    );
  }

  actualizarCliente(
    id: number,
    datos: Cliente
  ): Observable<RespuestaCliente> {
    return this.api.put<RespuestaCliente>(
      `clientes/${id}`,
      datos
    );
  }

  desactivarCliente(
    id: number
  ): Observable<RespuestaCliente> {
    return this.api.patch<RespuestaCliente>(
      `clientes/${id}/desactivar`,
      {}
    );
  }

  activarCliente(
    id: number
  ): Observable<RespuestaCliente> {
    return this.api.patch<RespuestaCliente>(
      `clientes/${id}/activar`,
      {}
    );
  }
}