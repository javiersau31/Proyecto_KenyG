import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UsuarioSesion {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioSesion;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:3000/api/auth';

  private sesionActivaSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );

  sesionActiva$ = this.sesionActivaSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: {
    usuario: string;
    contrasena: string;
  }): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  iniciarSesion(response: LoginResponse): void {

    localStorage.setItem('token', response.token);

    localStorage.setItem(
      'usuario',
      JSON.stringify(response.usuario)
    );

    this.sesionActivaSubject.next(true);
  }

  cerrarSesion(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.sesionActivaSubject.next(false);
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerUsuario(): UsuarioSesion | null {

    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
      return null;
    }

    try {
      return JSON.parse(usuario);
    } catch {
      return null;
    }
  }

  obtenerRol(): string | null {
    return this.obtenerUsuario()?.rol ?? null;
  }

  esAdmin(): boolean {
    return this.obtenerRol() === 'admin';
  }

  esVendedor(): boolean {
    return this.obtenerRol() === 'vendedor';
  }
}