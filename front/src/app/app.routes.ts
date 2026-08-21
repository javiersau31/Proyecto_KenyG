import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  {path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard]   },
  { path: 'usuarios', loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent), canActivate: [AuthGuard]   },
  {path: 'ventas', loadComponent: () => import('./ventas/ventas.component').then(m => m.VentasComponent) , canActivate: [AuthGuard]   },
  {path: 'clientes', loadComponent: () => import('./clientes/clientes.component').then(m => m.ClientesComponent), canActivate: [AuthGuard]   },
  {path: 'articulos', loadComponent: () => import('./articulos/articulos.component').then(m => m.ArticulosComponent), canActivate: [AuthGuard]},
  {path: 'categorias', loadComponent: () => import('./categorias/categorias.component').then(m => m.CategoriasComponent), canActivate: [AuthGuard]},
  { path: 'perfil', loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent), canActivate: [AuthGuard]   }, 
];
