import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UsuarioSesion } from '../servicios/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  usuario: UsuarioSesion | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
  }

  obtenerIniciales(): string {
    if (!this.usuario?.nombre) {
      return 'U';
    }

    return this.usuario.nombre
      .split(' ')
      .filter(nombre => nombre.length > 0)
      .slice(0, 2)
      .map(nombre => nombre.charAt(0).toUpperCase())
      .join('');
  }

  obtenerNombreRol(): string {
    return this.usuario?.rol === 'admin'
      ? 'Administrador'
      : 'Vendedor';
  }
}