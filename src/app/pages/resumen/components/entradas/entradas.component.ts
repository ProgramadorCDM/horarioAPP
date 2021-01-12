// Angular
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { transition, animate, AnimationEvent } from '@angular/animations';
import { trigger, state, style } from '@angular/animations';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
// PrimeNg
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
//Modelo
import { Persona } from 'src/app/core/models/Persona';
import { Proyecto } from 'src/app/core/models/Proyecto';
import { Registro } from 'src/app/core/models/Registro';
// Servicios
import { PersonaService } from 'src/app/core/services/persona.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProyectoService } from 'src/app/core/services/proyecto.service';
import { RegistroService } from 'src/app/core/services/registro.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css'],
  animations: [
    trigger('animation', [
      state(
        'visible',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition('void => *', [
        style({ transform: 'translateX(50%)', opacity: 0 }),
        animate('300ms ease-out'),
      ]),
      transition('* => void', [
        animate(
          '250ms ease-in',
          style({
            height: 0,
            opacity: 0,
            transform: 'translateX(50%)',
          })
        ),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EntradasComponent implements OnInit {
  personas: Persona[] = [];
  proyectos: Proyecto[] = [];
  registros: Registro[] = [];
  selectedPersona: Persona[] = [];
  listaPersonas: Persona[] = [];
  selectedProyecto: Proyecto;
  selectedRegistro: Registro;
  display: boolean = true;
  es: any;
  currentUser: any;
  roles: string[];
  defaultDate: Date;
  entradaHora: Date;
  salidaHora: Date;
  isfestivo: boolean;
  isSuccessful = false;
  isSignUpFailed = false;
  form: any = {};
  errorMessage = '';
  formEntrada: FormGroup;
  timeValue: string;
  cols: any[];
  items: MenuItem[];
  activity: string;
  date: Date = null;

  constructor(
    private personaService: PersonaService,
    private proyectoService: ProyectoService,
    private registroService: RegistroService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private token: TokenStorageService,
    private formBuilder: FormBuilder,
    private config: PrimeNGConfig
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

  obtenerProyectos() {
    this.proyectoService.getAll().subscribe(
      (result: any) => {
        let proyectos: Proyecto[] = [];
        for (let i = 0; i < result.length; i++) {
          let proyecto = result[i] as Proyecto;
          proyectos.push(proyecto);
        }
        this.proyectos = proyectos.sort(function (a, b) {
          if (a.idProyecto > b.idProyecto) {
            return 1;
          }
          if (a.idProyecto < b.idProyecto) {
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

  obtenerRegistros() {
    this.roles = this.currentUser.roles;
    this.registroService.getAll().subscribe((array: Registro[]) => {
      let registros: Registro[] = [];
      array.forEach(
        (registro) => {
          if (this.date === registro.fecha) {
            if (this.roles.includes('ROLE_ADMIN')) {
              registros.push(registro);
            } else if (registro.users == this.currentUser.username) {
              registros.push;
            }
          }
          this.registros = registros.sort(function (a, b) {
            if (a.persona['nombre'] > b.persona['nombre']) {
              return 1;
            }
            if (a.persona['nombre'] < b.persona['nombre']) {
              return -1;
            }
            // cuando a y b son iguales
            return 0;
          });
        },
        (error) => console.error(error)
      );
    });
  }

  agregarEntrada() {
    this.formEntrada.patchValue({ actividad: this.activity });
    this.formEntrada.patchValue({ fecha: this.date });
    this.formEntrada.patchValue({ festivo: this.isfestivo });
    this.formEntrada.patchValue({
      proyecto: this.selectedProyecto,
    });
    this.formEntrada.patchValue({ users: this.currentUser.username });
    /**
     * Se iguala a otra variable debido a que al reiniciar el formulario
     * este reinicia la variable selectedPersona
     */
    this.listaPersonas = this.selectedPersona;
    for (let i = 0; i < this.listaPersonas.length; i++) {
      let element = this.listaPersonas[i];
      this.formEntrada.patchValue({ persona: element });

      let filter = this.registros.filter(function (a) {
        return a.persona['cedula'] == element.cedula;
      });

      if (filter.length >= 2) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'No puede agregar a: ' +
            element.nombre +
            ' por que posee el maximo de registros',
        });
      } else {
        // console.log('cargando');
        let index = this.registros.findIndex(
          (e) => e.persona['cedula'] == element.cedula
        );
        if (index != -1) {
          this.registroService
            .segundo(this.registros[index].id, this.formEntrada.value)
            .subscribe(
              (result: any) => {
                let registro = result as Registro;
                this.validarRegistro(registro);
                this.obtenerRegistros();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Resultado',
                  detail: 'Se Agrego el Registro Correctamente',
                });
              },
              (error) => {
                console.log(error);
              }
            );
        } else {
          this.registroService.save(this.formEntrada.value).subscribe(
            (result: any) => {
              let registro = result as Registro;
              this.validarRegistro(registro);
              this.obtenerRegistros();
              this.messageService.add({
                severity: 'success',
                summary: 'Resultado',
                detail: 'Se Agrego el Registro Correctamente',
              });
            },
            (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'warn',
                summary: '¡¡¡Advertencia!!!',
                detail: 'No ha Seleccionado ningun Registro',
              });
            }
          );
        }
      }
    }
    this.formEntrada.reset();
  }
  validarRegistro(registro: Registro) {
    let index = this.registros.findIndex((e) => e.id == registro.id);
    if (index != -1) {
      this.registros[index] = registro;
    } else {
      this.registros.push(registro);
    }
  }

  get persona() {
    return this.formEntrada.get('persona');
  }

  get proyecto() {
    return this.formEntrada.get('proyecto');
  }

  get hora_entrada() {
    return this.formEntrada.get('hora_entrada');
  }

  get hora_salida() {
    return this.formEntrada.get('hora_salida');
  }

  get fecha() {
    return this.formEntrada.get('fecha');
  }

  get festivo() {
    return this.formEntrada.get('festivo');
  }
  get actividad() {
    return this.formEntrada.get('actividad');
  }

  onFechaChange() {
    this.obtenerRegistros();
  }

  aceptar() {
    let fecha = true;
    let proyecto = true;
    let actividad = true;
    if (this.date == null) {
      fecha = false;
      this.messageService.add({
        severity: 'error',
        summary: '¡¡¡Error!!!',
        detail: 'Seleccione una fecha',
      });
    }
    if (this.selectedProyecto == null) {
      proyecto = false;
      this.messageService.add({
        severity: 'error',
        summary: '¡¡¡Error!!!',
        detail: 'Debe Seleccionar un proyecto',
      });
    }
    if (this.activity == null || this.activity == '') {
      actividad = false;
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'Debe ingresar una actividad',
      });
    }
    if (fecha && proyecto && actividad) {
      this.obtenerRegistros();
      this.display = false;
    } else {
      console.log('Negativo al Civil');
    }
  }

  eliminar(){
    if (this.selectedRegistro == null || this.selectedRegistro.id == null) {
      this.messageService.add({
        severity: "warn",
        summary: "¡¡¡Advertencia!!!",
        detail: "No ha Seleccionado ningun Registro"
      });
      return;
    }
    this.confirmationService.confirm({
      message: "¿Está serguro que desea eliminar el registro?",
      accept: () => {
        this.registroService
          .delete(this.selectedRegistro.id)
          .subscribe((result: any) => {
            this.messageService.add({
              severity: "success",
              summary: "Resultado",
              detail:
                "Se elimino a el Registro No. " + result.id + " correctamente"
            });
            this.eliminarRegistro(result.id);
          });
      }
    });
  }

  eliminarRegistro(id: any) {
    this.registros.splice(this.registros.findIndex(e => (e.id = id)), 1);
    this.selectedRegistro = null;
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.isfestivo = false;
    this.formEntrada = this.formBuilder.group({
      fecha: new FormControl(),
      hora_entrada: new FormControl(null, Validators.required),
      hora_salida: new FormControl(null, Validators.required),
      persona: new FormControl(null, Validators.required),
      proyecto: new FormControl(),
      festivo: new FormControl(),
      actividad: new FormControl(),
      users: new FormControl(),
    });
    this.obtenerPersonas();
    this.obtenerProyectos();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'persona', subfield: 'nombre', header: 'Persona' },
      { field: 'proyecto', subfield: 'nombre', header: 'Proyecto' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'hora_entrada', header: 'Entrada' },
      { field: 'hora_salida', header: 'Salida' },
    ];
    this.items = [
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: () => this.eliminar(),
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-fw pi-refresh',
        command: () => this.obtenerRegistros(),
      },
      {
        label: 'Nueva Fecha',
        icon: 'pi pi-fw pi-plus',
        command: () => (this.display = true),
      },
    ];
    this.config.setTranslation({
      dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic',
      ],
      today: 'Hoy',
      clear: 'Borrar',
    });
  }
}
