import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {
  CategoriasService,
  Categoria
} from '../servicios/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent implements OnInit {

  categorias: Categoria[] = [];

  nuevaCategoria: Categoria = {
    nombre: '',
    descripcion: ''
  };

  categoriaEditando: Categoria | null = null;

  categoriaAEliminar: number | null = null;

  constructor(
    private categoriasService: CategoriasService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  // =========================
  // CARGAR CATEGORÍAS
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
  // CREAR
  // =========================

  agregarCategoria(): void {

    const nombre = this.nuevaCategoria.nombre.trim();
    const descripcion = this.nuevaCategoria.descripcion.trim();

    if (!nombre || !descripcion) {

      this.toastr.warning(
        'Completa todos los campos.',
        'Datos incompletos'
      );

      return;
    }

    const datos: Categoria = {
      nombre,
      descripcion
    };

    this.categoriasService.crearCategoria(datos).subscribe({

      next: (respuesta) => {

        this.toastr.success(
          respuesta.mensaje,
          'Categoría creada'
        );

        this.nuevaCategoria = {
          nombre: '',
          descripcion: ''
        };

        this.cargarCategorias();
      },

      error: (error) => {

        this.toastr.error(
          error.error?.mensaje ||
          'No se pudo crear la categoría',
          'Error'
        );
      }

    });
  }

  // =========================
  // EDITAR
  // =========================

  activarEdicion(categoria: Categoria): void {

    this.categoriaEditando = {
      ...categoria
    };
  }

  cancelarEdicion(): void {
    this.categoriaEditando = null;
  }

  guardarEdicion(): void {

    if (
      !this.categoriaEditando ||
      this.categoriaEditando.id_categoria === undefined
    ) {
      return;
    }

    const nombre = this.categoriaEditando.nombre.trim();
    const descripcion = this.categoriaEditando.descripcion.trim();

    if (!nombre || !descripcion) {

      this.toastr.warning(
        'Completa todos los campos.',
        'Datos incompletos'
      );

      return;
    }

    const id = this.categoriaEditando.id_categoria;

    const datos: Categoria = {
      nombre,
      descripcion
    };

    this.categoriasService
      .actualizarCategoria(id, datos)
      .subscribe({

        next: (respuesta) => {

          this.toastr.success(
            respuesta.mensaje,
            'Categoría actualizada'
          );

          this.categoriaEditando = null;

          this.cargarCategorias();
        },

        error: (error) => {

          this.toastr.error(
            error.error?.mensaje ||
            'No se pudo actualizar la categoría',
            'Error'
          );
        }

      });
  }

  // =========================
  // DESACTIVAR
  // =========================

  confirmarEliminacion(id: number | undefined): void {

    if (id === undefined) {
      return;
    }

    this.categoriaAEliminar = id;
  }

  cancelarEliminacion(): void {
    this.categoriaAEliminar = null;
  }

  eliminarCategoriaConfirmada(): void {

    if (this.categoriaAEliminar === null) {
      return;
    }

    const id = this.categoriaAEliminar;

    this.categoriasService
      .desactivarCategoria(id)
      .subscribe({

        next: (respuesta) => {

          this.toastr.success(
            respuesta.mensaje,
            'Categoría desactivada'
          );

          this.categoriaAEliminar = null;

          this.cargarCategorias();
        },

        error: (error) => {

          this.toastr.error(
            error.error?.mensaje ||
            'No se pudo desactivar la categoría',
            'Error'
          );

          this.categoriaAEliminar = null;
        }

      });
  }
}