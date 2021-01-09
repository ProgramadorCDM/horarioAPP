import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Modulos */
import { ResumenRoutingModule } from './resumen-routing.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
/* Components */
import { HomeComponent } from './components/home/home.component';
import { PersonasComponent } from './components/personas/personas.component';


@NgModule({
  declarations: [HomeComponent, PersonasComponent],
  imports: [
    CommonModule,
    ResumenRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ResumenModule {}
