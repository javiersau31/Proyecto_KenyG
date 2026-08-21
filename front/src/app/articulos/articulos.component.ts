import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {
  ArticulosService,
  Articulo
} from '../servicios/articulos.service';

import {
  CategoriasService,
  Categoria
} from '../servicios/categorias.service';

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articulos.component.html'
})
export class ArticulosComponent implements OnInit {

  // =========================
  // DATOS
  // =========================

  articulos: Articulo[] = [];
  categorias: Categoria[] = [];

  terminoBusqueda: string = '';

  mostrarFormulario: boolean = false;

  articuloEditando: Articulo | null = null;
  articuloAEliminar: number | null = null;

  nuevoArticulo: Articulo = this.crearArticuloVacio();


  constructor(
    private articulosService: ArticulosService,
    private categoriasService: CategoriasService,
    private toastr: ToastrService
  ) {}


  // =========================
  // INICIO
  // =========================

  ngOnInit(): void {

    this.cargarArticulos();
    this.cargarCategorias();

  }


  // =========================
  // ARTÍCULO VACÍO
  // =========================

  private crearArticuloVacio(): Articulo {

    return {
      nombre: '',
      descripcion: '',
      precio: 0,
      existencia: 0,
      id_categoria: 0
    };

  }


  // =========================
  // OBTENER ARTÍCULOS
  // =========================

  cargarArticulos(): void {

    this.articulosService.obtenerArticulos().subscribe({

      next: (articulos) => {

        this.articulos = articulos;

      },

      error: (error) => {

        console.error(error);

        this.toastr.error(
          error.error?.mensaje ||
          'Error al cargar los artículos',
          'Error'
        );

      }

    });

  }


  // =========================
  // OBTENER CATEGORÍAS
  // =========================

  cargarCategorias(): void {

    this.categoriasService.obtenerCategorias().subscribe({

      next: (categorias) => {

        this.categorias = categorias;

      },

      error: (error) => {

        console.error(error);

        this.toastr.error(
          error.error?.mensaje ||
          'Error al cargar las categorías',
          'Error'
        );

      }

    });

  }


  // =========================
  // FILTRO
  // =========================

  get articulosFiltrados(): Articulo[] {

    const termino = this.terminoBusqueda
      .trim()
      .toLowerCase();

    if (!termino) {
      return this.articulos;
    }

    return this.articulos.filter(articulo =>

      articulo.nombre.toLowerCase().includes(termino) ||

      articulo.descripcion.toLowerCase().includes(termino) ||

      (articulo.categoria ?? '')
        .toLowerCase()
        .includes(termino)

    );

  }


  // =========================
  // EXISTENCIAS TOTALES
  // =========================

  obtenerExistenciasTotales(): number {

    return this.articulos.reduce(
      (total, articulo) =>
        total + Number(articulo.existencia || 0),
      0
    );

  }


  // =========================
  // STOCK BAJO
  // =========================

  obtenerArticulosStockBajo(): number {

    return this.articulos.filter(
      articulo =>
        articulo.existencia > 0 &&
        articulo.existencia <= 10
    ).length;

  }


  // =========================
  // ABRIR FORMULARIO
  // =========================

  abrirFormulario(): void {

    this.articuloEditando = null;

    this.nuevoArticulo = this.crearArticuloVacio();

    this.mostrarFormulario = true;

  }


  // =========================
  // CERRAR FORMULARIO
  // =========================

  cerrarFormulario(): void {

    this.mostrarFormulario = false;

    this.articuloEditando = null;

    this.nuevoArticulo = this.crearArticuloVacio();

  }


  // =========================
  // CREAR / ACTUALIZAR
  // =========================

  guardarArticulo(): void {

    if (this.articuloEditando) {

      this.guardarEdicion();

    } else {

      this.agregarArticulo();

    }

  }


  // =========================
  // CREAR
  // =========================

  agregarArticulo(): void {

    if (
      !this.nuevoArticulo.nombre.trim() ||
      !this.nuevoArticulo.descripcion.trim() ||
      this.nuevoArticulo.precio <= 0 ||
      this.nuevoArticulo.existencia < 0 ||
      this.nuevoArticulo.id_categoria <= 0
    ) {

      this.toastr.warning(
        'Completa correctamente todos los campos.',
        'Datos inválidos'
      );

      return;

    }


    this.articulosService
      .crearArticulo(this.nuevoArticulo)
      .subscribe({

        next: (respuesta) => {

          this.toastr.success(
            respuesta.mensaje,
            'Artículo creado'
          );

          this.cerrarFormulario();

          this.cargarArticulos();

        },

        error: (error) => {

          console.error(error);

          this.toastr.error(
            error.error?.mensaje ||
            'No se pudo crear el artículo',
            'Error'
          );

        }

      });

  }


  // =========================
  // EDITAR
  // =========================

  activarEdicion(articulo: Articulo): void {

    this.articuloEditando = {
      ...articulo
    };

    console.log('Artículo recibido:', articulo);
  console.log('Existencia:', articulo.existencia);

    this.nuevoArticulo = {
    ...articulo
  };

  console.log('Artículo para editar:', this.articuloEditando);


    this.mostrarFormulario = true;

  }


  cancelarEdicion(): void {

    this.articuloEditando = null;

    this.mostrarFormulario = false;

  }


  guardarEdicion(): void {

  if (
    !this.articuloEditando ||
    !this.articuloEditando.id_articulo
  ) {
    return;
  }

  if (
    !this.nuevoArticulo.nombre.trim() ||
    !this.nuevoArticulo.descripcion.trim() ||
    this.nuevoArticulo.precio <= 0 ||
    this.nuevoArticulo.existencia < 0 ||
    this.nuevoArticulo.id_categoria <= 0
  ) {
    this.toastr.warning(
      'Completa correctamente todos los campos.',
      'Datos inválidos'
    );
    return;
  }

  const id = this.articuloEditando.id_articulo;

  this.articulosService
    .actualizarArticulo(
      id,
      this.nuevoArticulo
    )
    .subscribe({
      next: (respuesta) => {

        this.toastr.success(
          respuesta.mensaje,
          'Artículo actualizado'
        );

        this.cerrarFormulario();
        this.cargarArticulos();
      },

      error: (error) => {

        console.error(error);

        this.toastr.error(
          error.error?.mensaje ||
          'No se pudo actualizar el artículo',
          'Error'
        );
      }
    });
}

  // =========================
  // DESACTIVAR
  // =========================

  confirmarEliminacion(
    id: number | undefined
  ): void {

    if (id === undefined) {
      return;
    }

    this.articuloAEliminar = id;

  }


  cancelarEliminacion(): void {

    this.articuloAEliminar = null;

  }


  eliminarArticuloConfirmado(): void {

    if (this.articuloAEliminar === null) {
      return;
    }


    const id = this.articuloAEliminar;


    this.articulosService
      .desactivarArticulo(id)
      .subscribe({

        next: (respuesta) => {

          this.toastr.success(
            respuesta.mensaje,
            'Artículo desactivado'
          );

          this.articuloAEliminar = null;

          this.cargarArticulos();

        },

        error: (error) => {

          console.error(error);

          this.toastr.error(
            error.error?.mensaje ||
            'No se pudo desactivar el artículo',
            'Error'
          );

          this.articuloAEliminar = null;

        }

      });

  }

}