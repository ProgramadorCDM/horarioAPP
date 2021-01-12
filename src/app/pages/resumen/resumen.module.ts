import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Modulos */
import { ResumenRoutingModule } from './resumen-routing.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
/* Components */
import { HomeComponent } from './components/home/home.component';
import { PersonasComponent } from './components/personas/personas.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { EntradasComponent } from './components/entradas/entradas.component';
import { InformesComponent } from './components/informes/informes.component';


@NgModule({
  declarations: [
    HomeComponent,
    PersonasComponent,
    ProyectosComponent,
    EntradasComponent,
    InformesComponent,
  ],
  imports: [
    CommonModule,
    ResumenRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ResumenModule {}
