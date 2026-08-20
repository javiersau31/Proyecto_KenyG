import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono?: string | null;
  id_rol: number;
  rol: string;
  created_at: string;
}

export interface CrearUsuario {
  nombre: string;
  correo: string;
  telefono?: string | null;
  contrasena: string;
  id_rol: number;
}

export interface ActualizarUsuario {
  nombre: string;
  correo: string;
  telefono?: string | null;
  contrasena?: string;
  id_rol: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private api: ApiService) {}

  // =========================
  // USUARIOS
  // =========================

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>('usuarios');
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.api.get<Usuario>(`usuarios/${id}`);
  }

  crearUsuario(datos: CrearUsuario): Observable<any> {
    return this.api.post('usuarios', datos);
  }

  actualizarUsuario(
    id: number,
    datos: ActualizarUsuario
  ): Observable<any> {
    return this.api.put(`usuarios/${id}`, datos);
  }

  desactivarUsuario(id: number): Observable<any> {
    return this.api.patch(`usuarios/${id}/desactivar`, {});
  }

  activarUsuario(id: number): Observable<any> {
    return this.api.patch(`usuarios/${id}/activar`, {});
  }
}