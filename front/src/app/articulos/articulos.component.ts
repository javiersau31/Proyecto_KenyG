import { Component, OnInit } from '@angular/core';
import { ArticulosService, Articulo } from '../servicios/articulos.service';
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
      existencia: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.obtenerArticulos();
  }

  obtenerArticulos() {
    this.servicio.getArticulos().subscribe({
      next: (response) => {
        if (response.success) {
          this.articulos = response.data; // <--- AQUÍ LEES LOS DATOS GLOBALES
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al cargar los artículos', 'Error');
      }
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
        next: (response) => {
          this.toastr.success(response.message, 'Éxito'); // <--- MENSAJE DINÁMICO DEL BACKEND
          this.obtenerArticulos();
          this.cancelarEditar();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Error al actualizar', 'Error');
        }
      });
    } else {
      this.servicio.crearArticulo(articulo).subscribe({
        next: (response) => {
          this.toastr.success(response.message, 'Éxito'); // <--- MENSAJE DINÁMICO DEL BACKEND
          this.obtenerArticulos();
          this.articuloForm.reset();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Error al crear', 'Error');
        }
      });
    }
  }

  editarArticulo(articulo: Articulo) {
    this.modoEditar = true;
    this.idEditando = articulo.id_articulo!;
    this.articuloForm.patchValue(articulo);
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
        next: (response) => {
          this.obtenerArticulos();
          this.articuloAEliminar = null;
          this.toastr.success(response.message, 'Éxito'); // <--- MENSAJE DINÁMICO DEL BACKEND
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Error al eliminar el articulo', 'Error');
          this.articuloAEliminar = null;
        }
      });
    }
  }
}