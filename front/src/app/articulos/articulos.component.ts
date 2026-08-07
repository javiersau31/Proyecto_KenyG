import { Component, OnInit } from '@angular/core';
import { ArticulosService, Articulo, Categoria } from '../servicios/articulos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-articulos',
  standalone: true,
  templateUrl: './articulos.component.html',
  styleUrl: './articulos.component.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class ArticulosComponent implements OnInit {
  articulos: Articulo[] = [];
  categorias: Categoria[] = [];
  articuloForm: FormGroup;
  modoEditar: boolean = false;
  idEditando: number | null = null;
  articuloAEliminar: number | null = null;
  pestaniaActiva: 'formulario' | 'tabla' = 'formulario';

  constructor(private servicio: ArticulosService, private fb: FormBuilder, private toastr: ToastrService) {
    this.articuloForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      existencia: ['', [Validators.required, Validators.min(0)]],
      id_categoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerArticulos();
    this.obtenerCategorias();
  }

  obtenerArticulos() {
    this.servicio.getArticulos().subscribe(data => {
      this.articulos = data;
    });
  }

  obtenerCategorias() {
    this.servicio.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  guardarArticulo() {
    if (this.articuloForm.invalid) {
      this.articuloForm.markAllAsTouched();
      return;
    }

    const articulo = this.articuloForm.value;
    if (this.modoEditar && this.idEditando !== null) {
      this.servicio.actualizarArticulo(this.idEditando, articulo).subscribe({
        next: () => {
          this.toastr.success('Artículo actualizado correctamente', 'Éxito');
          this.obtenerArticulos();
          this.cancelarEditar();
          this.pestaniaActiva = 'tabla';
        },
        error: (err) => {
          this.toastr.error(err.error?.mensaje || 'Error al actualizar', 'Error');
        }
      });
    } else {
      this.servicio.crearArticulo(articulo).subscribe({
        next: () => {
          this.toastr.success('Artículo creado correctamente', 'Éxito');
          this.obtenerArticulos();
          this.articuloForm.reset();
          this.pestaniaActiva = 'tabla';
        },
        error: (err) => {
          this.toastr.error(err.error?.mensaje || 'Error al crear artículo', 'Error');
        }
      });
    }
  }

  editarArticulo(articulo: Articulo) {
    this.modoEditar = true;
    this.idEditando = articulo.id_articulo!;
    this.articuloForm.patchValue(articulo);
    this.pestaniaActiva = 'formulario';
  }

  cancelarEditar() {
    this.modoEditar = false;
    this.idEditando = null;
    this.articuloForm.reset();
  }

  confirmarEliminacionArticulo(id: number): void {
    this.articuloAEliminar = id;
  }

  cancelarEliminacionArticulo(): void {
    this.articuloAEliminar = null;
  }

  eliminarArticuloConfirmado(): void {
    if (this.articuloAEliminar !== null) {
      this.servicio.eliminarArticulo(this.articuloAEliminar).subscribe({
        next: () => {
          this.obtenerArticulos();
          this.articuloAEliminar = null;
          this.toastr.success('Artículo eliminado con éxito', 'Éxito');
        },
        error: (err) => {
          this.toastr.error(err.error?.mensaje || 'Error al eliminar el artículo', 'Error');
          this.articuloAEliminar = null;
        }
      });
    }
  }
}
