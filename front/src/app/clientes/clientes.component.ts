import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {
  ClientesService,
  Cliente
} from '../servicios/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];

  cargando = false;

  clienteEditando: Cliente | null = null;

  clienteAEliminar: number | null = null;

  nuevoCliente: Cliente = {
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  };

  constructor(
    private clientesService: ClientesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  // =========================
  // CARGAR CLIENTES
  // =========================

  cargarClientes(): void {

    this.cargando = true;

    this.clientesService.obtenerClientes().subscribe({

      next: (clientes) => {
        this.clientes = clientes;
        this.cargando = false;
      },

      error: (error) => {
        this.cargando = false;

        this.toastr.error(
          error.error?.mensaje || 'No se pudieron cargar los clientes.',
          'Error'
        );
      }

    });
  }

  // =========================
  // CREAR CLIENTE
  // =========================

  agregarCliente(): void {

    if (
      !this.nuevoCliente.nombre.trim() ||
      !this.nuevoCliente.direccion.trim() ||
      !this.nuevoCliente.telefono.trim() ||
      !this.nuevoCliente.correo.trim()
    ) {

      this.toastr.warning(
        'Completa todos los campos.',
        'Campos incompletos'
      );

      return;
    }

    this.clientesService.crearCliente(this.nuevoCliente).subscribe({

      next: (respuesta) => {

        this.toastr.success(
          respuesta.mensaje,
          'Cliente creado'
        );

        this.limpiarFormulario();
        this.cargarClientes();
      },

      error: (error) => {

        this.toastr.error(
          error.error?.mensaje || 'No se pudo crear el cliente.',
          'Error'
        );
      }

    });
  }

  // =========================
  // EDITAR
  // =========================

  activarEdicion(cliente: Cliente): void {

    this.clienteEditando = {
      ...cliente
    };
  }

  guardarEdicion(): void {

    if (!this.clienteEditando?.id_cliente) {
      return;
    }

    if (
      !this.clienteEditando.nombre.trim() ||
      !this.clienteEditando.direccion.trim() ||
      !this.clienteEditando.telefono.trim() ||
      !this.clienteEditando.correo.trim()
    ) {

      this.toastr.warning(
        'Completa todos los campos.',
        'Campos incompletos'
      );

      return;
    }

    this.clientesService.actualizarCliente(
      this.clienteEditando.id_cliente,
      this.clienteEditando
    ).subscribe({

      next: (respuesta) => {

        this.toastr.success(
          respuesta.mensaje,
          'Cliente actualizado'
        );

        this.clienteEditando = null;
        this.cargarClientes();
      },

      error: (error) => {

        this.toastr.error(
          error.error?.mensaje || 'No se pudo actualizar el cliente.',
          'Error'
        );
      }

    });
  }

  cancelarEdicion(): void {
    this.clienteEditando = null;
  }

  // =========================
  // DESACTIVAR
  // =========================

  confirmarEliminacion(id?: number): void {

    if (!id) {
      return;
    }

    this.clienteAEliminar = id;
  }

  cancelarEliminacion(): void {
    this.clienteAEliminar = null;
  }

  eliminarClienteConfirmado(): void {

    if (this.clienteAEliminar === null) {
      return;
    }

    const id = this.clienteAEliminar;

    this.clientesService.desactivarCliente(id).subscribe({

      next: (respuesta) => {

        this.toastr.success(
          respuesta.mensaje,
          'Cliente desactivado'
        );

        this.clienteAEliminar = null;
        this.cargarClientes();
      },

      error: (error) => {

        this.clienteAEliminar = null;

        this.toastr.error(
          error.error?.mensaje || 'No se pudo desactivar el cliente.',
          'Error'
        );
      }

    });
  }

  // =========================
  // FORMULARIO
  // =========================

  limpiarFormulario(): void {

    this.nuevoCliente = {
      nombre: '',
      direccion: '',
      telefono: '',
      correo: ''
    };
  }
}