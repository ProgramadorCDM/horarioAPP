import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from 'src/app/guards/login.guard';
import { HomeComponent } from './components/home/home.component';
import { PersonasComponent } from './components/personas/personas.component';
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
      { path: 'personas', component: PersonasComponent },
    ],
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenRoutingModule { }
