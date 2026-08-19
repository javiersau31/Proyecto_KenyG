import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService, Cliente } from '../servicios/clientes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  nuevoCliente: Partial<Cliente> = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
  };

  clienteEditando: Partial<Cliente> | null = null;
  errores: any = {};
  clienteAEliminar: number | null = null;

  constructor(private clienteService: ClientesService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (response) => {
        if (response.success) {
          this.clientes = response.data; // <--- AQUÍ LEES LOS DATOS GLOBALES
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al cargar los clientes', 'Error');
      }
    });
  }

  agregarCliente(): void {
    if (!this.nuevoCliente.nombre || this.nuevoCliente.nombre.trim().length < 3) {
      this.toastr.warning('El nombre debe tener al menos 3 caracteres', 'Advertencia');
      return;
    } 
    if (!this.nuevoCliente.email || this.nuevoCliente.email.trim().length <= 0) {
      this.toastr.warning('El email es obligatorio', 'Advertencia');
      return;
    } 
    if (!this.nuevoCliente.direccion || this.nuevoCliente.direccion.trim().length <= 0) {
      this.toastr.warning('La dirección es obligatoria', 'Advertencia');
      return;
    } 
    if (!this.nuevoCliente.telefono || isNaN(Number(this.nuevoCliente.telefono)) || this.nuevoCliente.telefono.trim().length < 7) {
      this.toastr.warning('El telefono debe ser un numero valido y tener al menos 7 caracteres', 'Advertencia');
      return;
    }

    this.clienteService.crearCliente(this.nuevoCliente).subscribe({
      next: (response) => {
        this.toastr.success(response.message, 'Éxito'); // <--- MENSAJE DINÁMICO DEL BACKEND
        this.nuevoCliente = {
          nombre: '',
          direccion: '',
          telefono: '',
          email: '',
        };
        this.cargarClientes();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al crear el cliente', 'Error');
      }
    });
  }

  confirmarEliminacion(id: number): void {
    this.clienteAEliminar = id;
  }

  cancelarEliminacion(): void {
    this.clienteAEliminar = null;
  }

  eliminarClienteConfirmado(): void {
    if (this.clienteAEliminar !== null) {
      this.clienteService.eliminarCliente(this.clienteAEliminar).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito'); // <--- MENSAJE DINÁMICO DEL BACKEND
          this.cargarClientes();
          this.clienteAEliminar = null;
        },
        error: (err) => {
          const mensaje = err.error?.message || 'No se pudo eliminar el cliente.';
          this.toastr.error(mensaje, 'Error');
          this.clienteAEliminar = null;
        }
      });
    }
  }

  activarEdicion(cliente: Cliente): void {
    this.clienteEditando = { ...cliente };
    this.errores = {}; 
  }

  guardarEdicion(): void {
    if (!this.clienteEditando) return;

    if (!this.validarCliente(this.clienteEditando)) return;

    this.clienteService
      .actualizarCliente(this.clienteEditando.id_cliente!, this.clienteEditando)
      .subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito'); // <--- MENSAJE DINÁMICO DEL BACKEND
          this.cancelarEdicion();
          this.cargarClientes();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Error al actualizar el cliente', 'Error');
        }
      });
  }

  cancelarEdicion(): void {
    this.clienteEditando = null;
    this.errores = {}; 
  }

  validarCliente(cliente: Partial<Cliente>): boolean {
    this.errores = {};

    if (!cliente.nombre || cliente.nombre.trim().length < 3) {
      this.errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!cliente.direccion || cliente.direccion.trim().length === 0) {
      this.errores.direccion = 'La dirección es obligatoria.';
    }
    if (!cliente.telefono || cliente.telefono.trim().length < 7) {
      this.errores.telefono = 'El teléfono debe tener al menos 7 caracteres.';
    }
    if (!cliente.email) {
      this.errores.email = 'El email es obligatorio.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cliente.email)) {
        this.errores.email = 'El email no tiene un formato valido.';
      }
    }

    return Object.keys(this.errores).length === 0;
  }
}