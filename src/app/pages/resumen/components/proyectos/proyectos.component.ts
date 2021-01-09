// Angular
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Services
import { ProyectoService } from 'src/app/core/services/proyecto.service';
// Modelos
import { Proyecto } from 'src/app/core/models/Proyecto';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[];
  proyecto: Proyecto;
  selectedProyecto: Proyecto;
  formProyecto: FormGroup;
  displaySaveDialog: boolean = false;
  items: MenuItem[];

  constructor(
    private proyectoService: ProyectoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  obtenerProyectos() {
    this.proyectoService.getAll().subscribe(
      (result: any) => {
        let proyectos: Proyecto[] = [];
        for (let i = 0; i < result.length; i++) {
          let proyecto = result[i] as Proyecto;
          proyectos.push(proyecto);
        }
        this.proyectos = proyectos.sort(function (a,b) {
          if (a.idProyecto > b.idProyecto) {
            return 1
          }
          if (a.idProyecto < b.idProyecto) {
            return -1
          }
          return 0;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  guardarProyecto() {
    this.proyectoService.save(this.proyecto).subscribe(
      (result: any) => {
        let proyecto = result as Proyecto;
        this.validarProyecto(proyecto);
        this.messageService.add({
          severity: 'success',
          summary: 'Resultado',
          detail: 'Se guardo el Proyecto correctamente',
        });
        this.displaySaveDialog = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  validarProyecto(proyecto: Proyecto) {
    let index = this.proyectos.findIndex(
      (e) => e.idProyecto == proyecto.idProyecto
    );
    if (index != -1) {
      this.proyectos[index] = proyecto;
    } else {
      this.proyectos.push(proyecto);
    }
    this.selectedProyecto = null;
  }

  mostrarDialogoGuardar(editar: boolean) {
    this.formProyecto.reset()
    if (editar) {
      if (
        this.selectedProyecto != null &&
        this.selectedProyecto.idProyecto != null
      ) {
        this.formProyecto.patchValue(this.selectedProyecto);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'No ha seleccionado ningun Proyecto',
        });
        return;
      }
    } else {
      this.proyecto = new Proyecto();
    }
    this.displaySaveDialog = true;
  }

  eliminar() {
    if (
      this.selectedProyecto == null ||
      this.selectedProyecto.idProyecto == null
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'No ha Seleccionado ningun Registro',
      });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar el proyecto?',
      accept: () => {
        this.proyectoService
          .delete(this.selectedProyecto.idProyecto)
          .subscribe((result: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Resultado',
              detail:
                'Se elimino el proyecto ' +
                result.idProyecto +
                ' correctamente',
            });
            this.eliminarProyecto(result.idProyecto);
          });
      },
    });
  }

  eliminarProyecto(idProyecto: string) {
    this.proyectos.splice(
      this.proyectos.findIndex((e) => e.idProyecto == idProyecto),
      1
    );
    this.selectedProyecto = null;
  }

  onGuardar() {
    this.proyecto = this.formProyecto.value
    this.guardarProyecto()
  }

  ngOnInit(): void {
    this.obtenerProyectos();
    this.formProyecto = this.fb.group({
      idProyecto: new FormControl(null, Validators.required),
      nombre: new FormControl(null, Validators.required),
    });
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => this.mostrarDialogoGuardar(false),
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.mostrarDialogoGuardar(true),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: () => this.eliminar(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerProyectos(),
      },
    ];
  }
}
