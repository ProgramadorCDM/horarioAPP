// Angular
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
// Models
import { Persona } from 'src/app/core/models/Persona';
// Services
import { PersonaService } from 'src/app/core/services/persona.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css'],
})
export class PersonasComponent implements OnInit {
  personas: Persona[];
  persona: Persona;
  selectedPersona: Persona;
  items: MenuItem[];
  personaForm: FormGroup;
  displaySaveDialog: boolean = false;
  tituloModal: string;

  constructor(
    private personaService: PersonaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  obtenerPersonas() {
    this.personaService.getAll().subscribe(
      (result: any) => {
        let personas: Persona[] = [];
        for (let i = 0; i < result.length; i++) {
          let persona = result[i] as Persona;
          personas.push(persona);
        }
        this.personas = personas.sort(function (a, b) {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          return 0;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  guardarPersonas() {
    this.personaService.save(this.persona).subscribe((result: any) => {
      let persona = result as Persona;
      this.validarPersona(persona);
      this.messageService.add({
        severity: 'success',
        summary: 'Resultado',
        detail: 'Se guardo a la persona correctamente',
      });
      this.displaySaveDialog = false;
    });
    (error) => {
      console.log(error);
    };
  }

  validarPersona(persona: Persona) {
    let index = this.personas.findIndex((e) => e.cedula == persona.cedula);
    if (index != -1) {
      this.personas[index] = persona;
    } else {
      this.personas.push(persona);
    }
  }

  mostrarDialogoGuardar(editar: boolean) {
    if (editar) {
      if (this.selectedPersona != null && this.selectedPersona.cedula != null) {
        this.personaForm.patchValue(this.selectedPersona);
        this.tituloModal = 'Editar';
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: '¡¡¡Advertencia!!!',
          detail: 'No ha Seleccionado ningun Registro',
        });
        return;
      }
    } else {
      this.persona = new Persona();
      this.tituloModal = 'Nueva';
    }
    this.displaySaveDialog = true;
  }

  eliminar() {
    if (this.selectedPersona == null || this.selectedPersona.cedula == null) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'No ha Seleccionado ningun Registro',
      });
      return;
    }
    this.confirmationService.confirm({
      message: '¿Está serguro que desea eliminar el registro?',
      accept: () => {
        this.personaService
          .delete(this.selectedPersona.cedula)
          .subscribe((result: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Resultado',
              detail: 'Se elimino a la persona ' + result.cedula + ' correctamente',
            });
            this.eliminarPersona(result.cedula);
          });
      },
    });
  }
  eliminarPersona(cedula: any) {
    this.personas.splice(
      this.personas.findIndex((e) => e.cedula == cedula),
      1
    );
  }

  onGuardar() {
    this.persona = this.personaForm.value;
    this.guardarPersonas();
  }

  ngOnInit(): void {
    this.obtenerPersonas();
    this.personaForm = this.fb.group({
      cedula: new FormControl(null, Validators.required),
      nombre: new FormControl(null, Validators.required),
      salario: new FormControl(null, Validators.required),
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
        command: () => this.obtenerPersonas(),
      },
    ];
  }
}
