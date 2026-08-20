import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth.service';
import { RouterLink } from '@angular/router';

import { VentasService, Venta } from '../servicios/ventas.service';
import { ClientesService, Cliente } from '../servicios/clientes.service';
import { ArticulosService, Articulo } from '../servicios/articulos.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  sesionActiva: boolean = false;

  totalVentas = 0;
  totalClientes = 0;
  totalArticulos = 0;

  constructor(
    private authService: AuthService,
    private ventasService: VentasService,
    private clientesService: ClientesService,
    private articulosService: ArticulosService
  ) {}

  ngOnInit(): void {

    this.authService.sesionActiva$.subscribe((estado) => {
      this.sesionActiva = estado;
    });

    this.cargarEstadisticas();

    console.log(
      'Token recuperado en Dashboard:',
      localStorage.getItem('token')
    );
  }

  cargarEstadisticas(): void {

    // =========================
    // VENTAS
    // =========================

    this.ventasService.obtenerVentas().subscribe({
      next: (ventas: Venta[]) => {
        this.totalVentas = ventas.length;
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
        this.totalVentas = 0;
      }
    });


    // =========================
    // CLIENTES
    // =========================

    this.clientesService.obtenerClientes().subscribe({
      next: (clientes: Cliente[]) => {
        this.totalClientes = clientes.length;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.totalClientes = 0;
      }
    });


    // =========================
    // ARTÍCULOS
    // =========================

    this.articulosService.obtenerArticulos().subscribe({
      next: (articulos: Articulo[]) => {
        this.totalArticulos = articulos.length;
      },
      error: (err) => {
        console.error('Error al cargar artículos:', err);
        this.totalArticulos = 0;
      }
    });
  }
}