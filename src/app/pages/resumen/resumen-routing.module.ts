import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { LoginGuard } from 'src/app/guards/login.guard';
import { EntradasComponent } from './components/entradas/entradas.component';
import { HomeComponent } from './components/home/home.component';
import { InformesComponent } from './components/informes/informes.component';
import { PersonasComponent } from './components/personas/personas.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { ResumenComponent } from './resumen.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
    canActivate: [LoginGuard],
  },
  {
    path: '',
    component: ResumenComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'personas',
        component: PersonasComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'proyectos',
        component: ProyectosComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'entradas',
        component: EntradasComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'informes',
        component: InformesComponent,
        canActivate: [LoginGuard, AdminGuard],
      },
    ],
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenRoutingModule { }
