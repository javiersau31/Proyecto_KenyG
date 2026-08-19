import { Component, OnInit } from '@angular/core';
import { VentasService, Cliente } from '../servicios/ventas.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './ventas.component.html',
})
export class VentasComponent implements OnInit {
  clientes: Cliente[] = [];
  articulos: any[] = [];

  ventaSeleccionada: number | null = null;
  id_clienteSeleccionado: number | null = null;
  id_admin: number = 1; 

  ventas: any[] = [];
  detallesVenta: any[] = [];

  mostrarFormulario = false;
  modoEdicion: { [id_detalle: number]: boolean } = {};
  ventaAEliminar: number | null = null;
  
  detalle = {
    id_articulo: null,
    nombre: null,
    cantidad: null,
    precio_u: null
  };

  constructor(private api: VentasService, private toastr: ToastrService) {}

  ngOnInit() {
    this.cargarVentas();
    
    // Cargar artículos usando la API global
    this.api.getarticulos().subscribe({
      next: (response) => {
        if (response.success) {
          this.articulos = response.data;
          console.log('Artículos cargados:', response.data);
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al cargar artículos', 'Error');
      }
    });

    // Cargar clientes usando la API global
    this.api.getClientes().subscribe({
      next: (response) => {
        if (response.success) {
          this.clientes = response.data;
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al cargar clientes', 'Error');
      }
    });
  }

  onArticuloChange() {
    const articuloSeleccionado = this.articulos.find(
      a => a.id_articulo === this.detalle.id_articulo
    );
    if (articuloSeleccionado) {
      this.detalle.precio_u = articuloSeleccionado.precio;
    } else {
      this.detalle.precio_u = null;
    }
  }

  crearVenta() {
    if (!this.id_clienteSeleccionado) {
      this.toastr.warning('Por favor, selecciona un cliente.', 'Advertencia');
      return;
    }

    this.api.crearVenta(this.id_admin, this.id_clienteSeleccionado).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Venta creada con éxito', 'Éxito');
        this.mostrarFormulario = false;
        this.cargarVentas();
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Error al crear la venta', 'Error');
        console.error('Error al crear la venta:', error);
      }
    });
  }

  cargarVentas() {
    this.api.getventas().subscribe({
      next: (response) => {
        if (response.success) {
          this.ventas = response.data;
          console.log('Ventas cargadas:', response.data);
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al cargar las ventas', 'Error');
      }
    });
  }

  abrirModalDetalle(id_venta: number) {
    if (this.ventaSeleccionada === id_venta) {
      this.ventaSeleccionada = null; 
      this.detallesVenta = [];
    } else {
      this.ventaSeleccionada = id_venta; 
      this.api.getDetallesVenta(id_venta).subscribe({
        next: (response) => {
          if (response.success) {
            this.detallesVenta = response.data;
          }
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Error al cargar detalles', 'Error');
        }
      });
    }

    this.detalle = { id_articulo: null, nombre: null, cantidad: null, precio_u: null };
  }

  agregarDetalle() {
    if (!this.detalle.id_articulo || this.detalle.cantidad == null) {
      this.toastr.warning('Por favor, completa todos los campos.', 'Advertencia');
      return;
    }

    if (isNaN(Number(this.detalle.cantidad)) || Number(this.detalle.cantidad) <= 0) {
      this.toastr.warning('La cantidad debe ser un número válido y mayor a 0.', 'Advertencia');
      return;
    }

    const detalleCompleto = {
      id_venta: this.ventaSeleccionada, 
      ...this.detalle,
    };

    this.api.agregarDetalle(detalleCompleto).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Detalle agregado con éxito', 'Éxito');
        this.detalle = { id_articulo: null, nombre: null, cantidad: null, precio_u: null }; 
        this.cargarVentas(); 
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Error al agregar el detalle', 'Error');
      }
    });
  }

  verDetalles(id_venta: number) {
    this.api.getDetallesVenta(id_venta).subscribe({
      next: (response) => {
        if (response.success) {
          this.detallesVenta = response.data;
          this.ventaSeleccionada = id_venta;
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al ver detalles', 'Error');
      }
    });
  }

  activarEdicion(id_detalle: number) {
    this.modoEdicion[id_detalle] = true;
  }

  guardarEdicion(detalle: any) {
    if (detalle.cantidad == null) {
      this.toastr.warning('Por favor, completa todos los campos.', 'Advertencia');
      return;
    }

    if (isNaN(detalle.cantidad) || isNaN(detalle.precio_u)) {
      this.toastr.warning('La cantidad y el precio deben ser números válidos.', 'Advertencia');
      return;
    }

    if (detalle.cantidad <= 0 || detalle.precio_u <= 0) {
      this.toastr.warning('La cantidad y el precio deben ser mayores a 0.', 'Advertencia');
      return;
    }

    this.api.editarDetalle(detalle.id_detalle, detalle).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Detalle actualizado con éxito', 'Éxito');
        this.modoEdicion[detalle.id_detalle] = false;
        this.cargarVentas();
        if (this.ventaSeleccionada) {
          this.verDetalles(this.ventaSeleccionada);
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al actualizar el detalle', 'Error');
      }
    });
  }

  eliminarDetalle(id_detalle: number) {
    if (confirm('¿Seguro que deseas eliminar este detalle?')) {
      this.api.eliminarDetalle(id_detalle).subscribe({
        next: (response) => {
          this.toastr.success(response.message || 'Detalle eliminado con éxito', 'Éxito');
          if (this.ventaSeleccionada) {
            this.verDetalles(this.ventaSeleccionada);
          }
          this.cargarVentas();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Error al eliminar el detalle', 'Error');
        }
      });
    }
  }

  confirmarEliminacionVenta(id: number): void {
    this.ventaAEliminar = id;
  }

  cancelarEliminacionVenta(): void {
    this.ventaAEliminar = null;
  }

  eliminarVentaConfirmada(): void {
    if (this.ventaAEliminar !== null) {
      this.api.eliminarVenta(this.ventaAEliminar).subscribe({
        next: (response) => {
          this.cargarVentas();
          this.ventaAEliminar = null;
          this.toastr.success(response.message || 'Venta eliminada con éxito', 'Éxito');
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Error al eliminar la venta', 'Error');
          this.ventaAEliminar = null;
        }
      });
    }
  }
}