import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AutocompleteComponent } from '../core/components/autocomplete.component';
import {
  VentasService,
  Venta,
  DetalleVenta
} from '../servicios/ventas.service';

import {
  ClientesService,
  Cliente
} from '../servicios/clientes.service';

import {
  ArticulosService,
  Articulo
} from '../servicios/articulos.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutocompleteComponent
  ],
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {

  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  articulos: Articulo[] = [];
  textoArticulo = '';
  articulosFiltrados: Articulo[] = [];
  mostrarArticulos = false;
  // AUTOCOMPLETE CLIENTES
  textoCliente = '';
  clientesFiltrados: Cliente[] = [];
  mostrarClientes = false;

  ventaSeleccionada: number | null = null;
  detallesVenta: DetalleVenta[] = [];

  idClienteSeleccionado: number | null = null;

  mostrarFormulario = false;

  ventaAEliminar: number | null = null;

  modoEdicion: { [id: number]: boolean } = {};

  

  detalle = {
    id_articulo: null as number | null,
    cantidad: null as number | null,
    precio_unitario: null as number | null
  };

  constructor(
    private ventasService: VentasService,
    private clientesService: ClientesService,
    private articulosService: ArticulosService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarClientes();
    this.cargarArticulos();
  }

  
  // =========================
  // CARGAR DATOS
  // =========================

  cargarVentas(): void {

    this.ventasService.obtenerVentas().subscribe({
      next: (ventas) => {
        this.ventas = ventas;
      },

      error: (err) => {
        console.error(err);
        this.toastr.error(
          err.error?.mensaje || 'Error al cargar las ventas',
          'Error'
        );
      }
    });

  }

  cargarClientes(): void {
    this.clientesService.obtenerClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = clientes;
      },
      error: (err) => {
        console.error(err);

        this.toastr.error(
          err.error?.mensaje || 'Error al cargar los clientes',
          'Error'
        );
      }
    });
  }
  seleccionarCliente(cliente: Cliente): void {
    if (cliente.id_cliente == null) {
      return;
    }

    this.idClienteSeleccionado = cliente.id_cliente;
    this.textoCliente = cliente.nombre;
    this.mostrarClientes = false;
  }

  buscarClientes(): void {
  const texto = this.textoCliente.trim().toLowerCase();

  if (!texto) {
    this.clientesFiltrados = this.clientes.slice(0, 10);
    this.mostrarClientes = true;
    return;
  }

  this.clientesFiltrados = this.clientes
    .filter(cliente =>
      cliente.nombre?.toLowerCase().includes(texto)
    )
    .slice(0, 10);

  this.mostrarClientes = true;
}

  cargarArticulos(): void {

    this.articulosService.obtenerArticulos().subscribe({
      next: (articulos) => {
        this.articulos = articulos;
      },

      error: (err) => {
        console.error(err);
        this.toastr.error(
          err.error?.mensaje || 'Error al cargar los artículos',
          'Error'
        );
      }
    });

  }

  // =========================
  // VENTA
  // =========================

  crearVenta(): void {

    if (!this.idClienteSeleccionado) {

      this.toastr.warning(
        'Selecciona un cliente.',
        'Advertencia'
      );

      return;
    }

    this.ventasService.crearVenta({
      id_cliente: this.idClienteSeleccionado
    }).subscribe({

      next: (response) => {

        this.toastr.success(
          response.mensaje || 'Venta creada correctamente.',
          'Éxito'
        );

        this.idClienteSeleccionado = null;
        this.mostrarFormulario = false;

        this.cargarVentas();
      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.mensaje || 'Error al crear la venta.',
          'Error'
        );

      }

    });

  }

  // =========================
  // DETALLES
  // =========================

  verDetalles(idVenta: number): void {

    if (this.ventaSeleccionada === idVenta) {

      this.ventaSeleccionada = null;
      this.detallesVenta = [];

      return;
    }

    this.ventaSeleccionada = idVenta;

    this.ventasService.obtenerDetalles(idVenta).subscribe({

      next: (detalles) => {
        this.detallesVenta = detalles;
      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.mensaje || 'Error al cargar los detalles.',
          'Error'
        );

      }

    });

  }


  // =========================
  // AGREGAR DETALLE
  // =========================

  agregarDetalle(): void {

    if (!this.ventaSeleccionada) {

      this.toastr.warning(
        'Selecciona una venta.',
        'Advertencia'
      );

      return;
    }

    if (
      !this.detalle.id_articulo ||
      !this.detalle.cantidad 

    ) {

      this.toastr.warning(
        'Completa todos los campos.',
        'Advertencia'
      );

      return;
    }

    if (
      !Number.isInteger(this.detalle.cantidad) ||
      this.detalle.cantidad <= 0
    ) {
      this.toastr.warning(
        'La cantidad debe ser un número entero mayor a cero.',
        'Advertencia'
      );
      return;
}

    this.ventasService.agregarDetalle({

      id_venta: this.ventaSeleccionada,

      id_articulo: this.detalle.id_articulo,

      cantidad: this.detalle.cantidad,

    }).subscribe({

      next: (response) => {

        this.toastr.success(
          response.mensaje || 'Artículo agregado correctamente.',
          'Éxito'
        );

        this.limpiarDetalle();

        this.verDetalles(this.ventaSeleccionada!);

        this.cargarVentas();

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.mensaje || 'Error al agregar el artículo.',
          'Error'
        );

      }

    });

  }

  // =========================
  // EDITAR DETALLE
  // =========================

  activarEdicion(idDetalle: number): void {
    this.modoEdicion[idDetalle] = true;
  }

  guardarEdicion(detalle: DetalleVenta): void {

  if (
    !Number.isInteger(detalle.cantidad) ||
    detalle.cantidad <= 0
  ) {
    this.toastr.warning(
      'La cantidad debe ser un número entero mayor a cero.',
      'Advertencia'
    );
    return;
  }

  this.ventasService.editarDetalle(
    detalle.id_detalle,
    detalle.cantidad
  ).subscribe({
    next: (response) => {

      this.toastr.success(
        response.mensaje || 'Detalle actualizado correctamente.',
        'Éxito'
      );

      this.modoEdicion[detalle.id_detalle] = false;

      if (this.ventaSeleccionada) {
        this.verDetalles(this.ventaSeleccionada);
      }

      this.cargarVentas();
    },

    error: (err) => {
      console.error(err);

      this.toastr.error(
        err.error?.mensaje || 'Error al actualizar el detalle.',
        'Error'
      );
    }
  });
}

  // =========================
  // ELIMINAR DETALLE
  // =========================

  eliminarDetalle(idDetalle: number): void {

    if (!confirm('¿Seguro que deseas eliminar este detalle?')) {
      return;
    }

    this.ventasService.eliminarDetalle(idDetalle).subscribe({

      next: (response) => {

        this.toastr.success(
          response.mensaje || 'Detalle eliminado correctamente.',
          'Éxito'
        );

        if (this.ventaSeleccionada) {
          this.verDetalles(this.ventaSeleccionada);
        }

        this.cargarVentas();

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.mensaje || 'Error al eliminar el detalle.',
          'Error'
        );

      }

    });

  }

  abrirModalDetalle(id_venta: number) {
  if (this.ventaSeleccionada === id_venta) {
    this.ventaSeleccionada = null;
    this.detallesVenta = [];
    return;
  }

  this.ventaSeleccionada = id_venta;

  this.ventasService.obtenerDetalles(id_venta).subscribe({
    next: (detalles) => {
      this.detallesVenta = detalles;
    },
    error: (err) => {
      this.toastr.error(
        err.error?.mensaje || 'Error al cargar detalles',
        'Error'
      );
    }
  });
}

  // =========================
  // ELIMINAR VENTA
  // =========================

  confirmarEliminacionVenta(idVenta: number): void {
    this.ventaAEliminar = idVenta;
  }

  cancelarEliminacionVenta(): void {
    this.ventaAEliminar = null;
  }

  eliminarVentaConfirmada(): void {

    if (this.ventaAEliminar === null) {
      return;
    }

    this.ventasService
      .eliminarVenta(this.ventaAEliminar)
      .subscribe({

        next: (response) => {

          this.toastr.success(
            response.mensaje || 'Venta eliminada correctamente.',
            'Éxito'
          );

          this.ventaAEliminar = null;
          this.ventaSeleccionada = null;
          this.detallesVenta = [];

          this.cargarVentas();

        },

        error: (err) => {

          console.error(err);

          this.toastr.error(
            err.error?.mensaje || 'Error al eliminar la venta.',
            'Error'
          );

          this.ventaAEliminar = null;

        }

      });

  }

  // =========================
  // LIMPIAR FORMULARIO
  // =========================

  limpiarDetalle(): void {

    this.detalle = {
      id_articulo: null,
      cantidad: null,
      precio_unitario: null
    };

  }



buscarArticulos(): void {
  const texto = this.textoArticulo.trim().toLowerCase();

  if (!texto) {
    this.articulosFiltrados = [];
    this.mostrarArticulos = false;
    return;
  }

  this.articulosFiltrados = this.articulos.filter(articulo =>
    articulo.nombre.toLowerCase().includes(texto)
  );

  this.mostrarArticulos = true;
}

seleccionarArticulo(articulo: Articulo): void {

if (articulo.id_articulo == undefined) {
  return;
}
  this.detalle.id_articulo = articulo.id_articulo;
  this.detalle.precio_unitario = articulo.precio;

  this.textoArticulo = articulo.nombre;

  this.articulosFiltrados = [];
  this.mostrarArticulos = false;
}
}