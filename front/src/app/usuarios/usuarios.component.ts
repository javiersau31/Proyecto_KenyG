import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {
  UsuariosService,
  Usuario,
  CrearUsuario,
  ActualizarUsuario
} from '../servicios/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {

  // =========================
  // DATOS
  // =========================

  usuarios: Usuario[] = [];

  roles = [
    {
      id_rol: 1,
      nombre: 'Administrador'
    },
    {
      id_rol: 2,
      nombre: 'Vendedor'
    }
  ];

  // =========================
  // FORMULARIO
  // =========================

  mostrarFormulario = false;

  modoEdicion = false;

  usuarioSeleccionado: number | null = null;

  usuarioAEliminar: number | null = null;

  usuario = {
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: '',
    id_rol: null as number | null
  };

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private usuariosService: UsuariosService,
    private toastr: ToastrService
  ) {}

  // =========================
  // INICIO
  // =========================

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // =========================
  // CARGAR USUARIOS
  // =========================

  cargarUsuarios(): void {

    this.usuariosService.obtenerUsuarios().subscribe({

      next: (usuarios) => {
        this.usuarios = usuarios;
      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.mensaje || 'Error al cargar los usuarios.',
          'Error'
        );

      }

    });

  }

  // =========================
  // ABRIR CREAR
  // =========================

  abrirFormularioCrear(): void {

    this.modoEdicion = false;

    this.usuarioSeleccionado = null;

    this.limpiarFormulario();

    this.mostrarFormulario = true;

  }

  // =========================
  // ABRIR EDITAR
  // =========================

  editarUsuario(id: number): void {

    this.usuariosService.obtenerUsuarioPorId(id).subscribe({

      next: (usuario) => {

        this.modoEdicion = true;

        this.usuarioSeleccionado = usuario.id_usuario;

        this.usuario = {
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono || '',
          contrasena: '',
          id_rol: usuario.id_rol
        };

        this.mostrarFormulario = true;

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.mensaje || 'Error al obtener el usuario.',
          'Error'
        );

      }

    });

  }

  // =========================
  // GUARDAR
  // =========================

  guardarUsuario(): void {

    // -------------------------
    // VALIDACIONES
    // -------------------------

    if (
      !this.usuario.nombre.trim() ||
      !this.usuario.correo.trim() ||
      this.usuario.id_rol === null
    ) {

      this.toastr.warning(
        'Completa todos los campos obligatorios.',
        'Advertencia'
      );

      return;
    }

    // Contraseña obligatoria solamente al crear

    if (
      !this.modoEdicion &&
      !this.usuario.contrasena.trim()
    ) {

      this.toastr.warning(
        'La contraseña es obligatoria.',
        'Advertencia'
      );

      return;
    }

    // Longitud de contraseña

    if (
      this.usuario.contrasena &&
      this.usuario.contrasena.length < 6
    ) {

      this.toastr.warning(
        'La contraseña debe tener al menos 6 caracteres.',
        'Advertencia'
      );

      return;
    }

    // -------------------------
    // CREAR
    // -------------------------

    if (!this.modoEdicion) {

      const datos: CrearUsuario = {
        nombre: this.usuario.nombre,
        correo: this.usuario.correo,
        telefono: this.usuario.telefono || null,
        contrasena: this.usuario.contrasena,
        id_rol: this.usuario.id_rol
      };

      this.usuariosService.crearUsuario(datos).subscribe({

        next: (response) => {

          this.toastr.success(
            response.mensaje || 'Usuario creado correctamente.',
            'Éxito'
          );

          this.cerrarFormulario();

          this.cargarUsuarios();

        },

        error: (err) => {

          console.error(err);

          this.toastr.error(
            err.error?.mensaje || 'Error al crear el usuario.',
            'Error'
          );

        }

      });

      return;
    }

    // -------------------------
    // EDITAR
    // -------------------------

    if (this.usuarioSeleccionado === null) {
      return;
    }

    const datos: ActualizarUsuario = {
      nombre: this.usuario.nombre,
      correo: this.usuario.correo,
      telefono: this.usuario.telefono || null,
      id_rol: this.usuario.id_rol
    };

    // Solamente mandar contraseña si escribió una nueva

    if (this.usuario.contrasena.trim()) {
      datos.contrasena = this.usuario.contrasena;
    }

    this.usuariosService
      .actualizarUsuario(
        this.usuarioSeleccionado,
        datos
      )
      .subscribe({

        next: (response) => {

          this.toastr.success(
            response.mensaje || 'Usuario actualizado correctamente.',
            'Éxito'
          );

          this.cerrarFormulario();

          this.cargarUsuarios();

        },

        error: (err) => {

          console.error(err);

          this.toastr.error(
            err.error?.mensaje || 'Error al actualizar el usuario.',
            'Error'
          );

        }

      });

  }

  // =========================
  // DESACTIVAR
  // =========================

  confirmarDesactivacion(id: number): void {

    this.usuarioAEliminar = id;

  }

  cancelarDesactivacion(): void {

    this.usuarioAEliminar = null;

  }

  desactivarUsuario(): void {

    if (this.usuarioAEliminar === null) {
      return;
    }

    this.usuariosService
      .desactivarUsuario(this.usuarioAEliminar)
      .subscribe({

        next: (response) => {

          this.toastr.success(
            response.mensaje || 'Usuario desactivado correctamente.',
            'Éxito'
          );

          this.usuarioAEliminar = null;

          this.cargarUsuarios();

        },

        error: (err) => {

          console.error(err);

          this.toastr.error(
            err.error?.mensaje || 'Error al desactivar el usuario.',
            'Error'
          );

          this.usuarioAEliminar = null;

        }

      });

  }

  // =========================
  // ACTIVAR
  // =========================

  activarUsuario(id: number): void {

    this.usuariosService.activarUsuario(id).subscribe({

      next: (response) => {

        this.toastr.success(
          response.mensaje || 'Usuario activado correctamente.',
          'Éxito'
        );

        this.cargarUsuarios();

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.mensaje || 'Error al activar el usuario.',
          'Error'
        );

      }

    });

  }

  // =========================
  // CERRAR FORMULARIO
  // =========================

  cerrarFormulario(): void {

    this.mostrarFormulario = false;

    this.modoEdicion = false;

    this.usuarioSeleccionado = null;

    this.limpiarFormulario();

  }

  // =========================
  // LIMPIAR
  // =========================

  limpiarFormulario(): void {

    this.usuario = {
      nombre: '',
      correo: '',
      telefono: '',
      contrasena: '',
      id_rol: null
    };

  }

}