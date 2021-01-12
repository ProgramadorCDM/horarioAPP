import { Component, OnInit } from '@angular/core';
// PrimeNG
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { TreeNode } from 'primeng/api';
// Modelos
import { Persona } from 'src/app/core/models/Persona';
import { Proyecto } from 'src/app/core/models/Proyecto';
import { Registro } from 'src/app/core/models/Registro';
// Servicios
import { PersonaService } from 'src/app/core/services/persona.service';
import { ProyectoService } from 'src/app/core/services/proyecto.service';
import { RegistroService } from 'src/app/core/services/registro.service';
// Utilidades
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css'],
})
export class InformesComponent implements OnInit {
  // Declaracion de Variables
  personas: Persona[];
  proyectos: Proyecto[];
  registros: Registro[];
  selectedPersona: Persona;
  selectedProyecto: Proyecto;
  selectedRegistro: Registro;
  files: TreeNode[];
  cols: any[];
  exportColumns: any[];
  rowGroupMetadata: any;
  items: MenuItem[];
  prestaciones: boolean;
  total: number;
  display: boolean = true;
  es: any;
  fechaInicial: Date;
  fechaFinal: Date;

  constructor(
    private personaService: PersonaService,
    private proyectoService: ProyectoService,
    private registroService: RegistroService,
    private messageService: MessageService,
    private config: PrimeNGConfig
  ) {}

  /**
   * Metodo para Obtener todos los Registros
   */
  getAllRegistros() {
    this.display = false; // Desactivamos el Modal
    /** Obtenermos los registros desde el servicio */
    this.registroService.getAll().subscribe(
      (result: any) => {
        let registros: Registro[] = [];
        for (let i = 0; i < result.length; i++) {
          let registro = result[i] as Registro;
          if (
            this.selectedPersona != null &&
            this.selectedPersona.cedula != null
          ) {
            if (
              registro.fecha >= this.fechaInicial &&
              registro.fecha <= this.fechaFinal &&
              registro.persona['cedula'] == this.selectedPersona.cedula
            ) {
              registros.push(registro);
            }
          } else {
            if (
              registro.fecha >= this.fechaInicial &&
              registro.fecha <= this.fechaFinal
            ) {
              registros.push(registro);
            }
          }
        }
        this.registros = this.registros = registros.sort(function (a, b) {
          if (a.fecha > b.fecha) {
            return 1;
          }
          if (a.fecha < b.fecha) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getAllPersona() {
    this.personaService.getAll().subscribe(
      (result: any) => {
        let personas: Persona[] = [];
        for (let i = 0; i < result.length; i++) {
          let persona = result[i] as Persona;
          personas.push(persona);
        }
        this.personas = personas;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllProyecto() {
    this.proyectoService.getAll().subscribe(
      (result: any) => {
        let proyectos: Proyecto[] = [];
        for (let i = 0; i < result.length; i++) {
          let proyecto = result[i] as Proyecto;
          proyectos.push(proyecto);
        }
        this.proyectos = proyectos;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.registros) {
      for (let i = 0; i < this.registros.length; i++) {
        let rowData = this.registros[i].persona['cedula'];
        let persona = rowData;
        if (i == 0) {
          this.rowGroupMetadata[persona] = {
            index: 0,
            size: 1,
            ho: this.registros[i].hora_ordinaria,
            rn: this.registros[i].recargo_nocturno,
            he: this.registros[i].hora_extra,
            hen: this.registros[i].hora_extra_nocturna,
            hef: this.registros[i].hora_extra_festiva,
            hefn: this.registros[i].hora_extra_festiva_nocturna,
            salario_sin_prestaciones: this.registros[i]
              .salario_sin_prestaciones,
            salario_con_prestaciones: this.registros[i]
              .salario_con_prestaciones,
          };
        } else {
          let previousRowData = this.registros[i - 1].persona['cedula'];
          let previousRowGroup = previousRowData;
          if (persona === previousRowGroup) {
            this.rowGroupMetadata[persona].size++;
            this.rowGroupMetadata[persona].ho =
              this.rowGroupMetadata[persona].ho +
              this.registros[i].hora_ordinaria;
            this.rowGroupMetadata[persona].rn =
              this.rowGroupMetadata[persona].rn +
              this.registros[i].recargo_nocturno;
            this.rowGroupMetadata[persona].he =
              this.rowGroupMetadata[persona].he + this.registros[i].hora_extra;
            this.rowGroupMetadata[persona].hen =
              this.rowGroupMetadata[persona].hen +
              this.registros[i].hora_extra_nocturna;
            this.rowGroupMetadata[persona].hef =
              this.rowGroupMetadata[persona].hef +
              this.registros[i].hora_extra_festiva;
            this.rowGroupMetadata[persona].hefn =
              this.rowGroupMetadata[persona].hefn +
              this.registros[i].hora_extra_festiva_nocturna;
            this.rowGroupMetadata[persona].salario_sin_prestaciones =
              this.rowGroupMetadata[persona].salario_sin_prestaciones +
              this.registros[i].salario_sin_prestaciones;
            this.rowGroupMetadata[persona].salario_con_prestaciones =
              this.rowGroupMetadata[persona].salario_con_prestaciones +
              this.registros[i].salario_con_prestaciones;
          } else {
            this.rowGroupMetadata[persona] = {
              index: i,
              size: 1,
              ho: this.registros[i].hora_ordinaria,
              rn: this.registros[i].recargo_nocturno,
              he: this.registros[i].hora_extra,
              hen: this.registros[i].hora_extra_nocturna,
              hef: this.registros[i].hora_extra_festiva,
              hefn: this.registros[i].hora_extra_festiva_nocturna,
              salario_sin_prestaciones: this.registros[i]
                .salario_sin_prestaciones,
              salario_con_prestaciones: this.registros[i]
                .salario_con_prestaciones,
            };
          }
        }
      }
    }
  }

  aceptar() {
    if (this.fechaInicial == null) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advertencia!!!',
        detail: 'Seleccione una fecha de inicio',
      });
    }
    if (this.fechaFinal == null) {
      this.messageService.add({
        severity: 'warn',
        summary: '¡¡¡Advetencia!!!',
        detail: 'Seleccione una fecha final',
      });
    }
    if (this.fechaFinal != null && this.fechaInicial != null) {
      this.getAllRegistros();
      this.display = false;
    }
  }

  ngOnInit(): void {
    this.total = 0;
    this.getAllPersona();
    this.getAllProyecto();
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
    this.cols = [
      {
        field: 'persona',
        subfield: 'nombre',
        header: 'Persona',
      },
      { field: 'hora_ordinaria', header: 'HO' },
      { field: 'recargo_nocturno', header: 'RN' },
      { field: 'hora_extra', header: 'HE' },
      { field: 'hora_extra_nocturna', header: 'HEN' },
      { field: 'hora_extra_festiva', header: 'HEF' },
      { field: 'hora_extra_festiva_nocturna', header: 'HEFN' },
      { field: 'salario_sin_prestaciones', header: 'Salario' },
      { field: 'salario_sin_prestaciones', header: 'Salario' },
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.table_to_sheet(
        document.getElementById('dt')
      );
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'InformesExcel');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }
  exportPdf() {
    let documento = document.getElementById('dt');
    let opciones = {
      margin: [0.5, 0.5, 1, 0.5],
      filename: 'Informe.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'cm',
        format: 'letter',
        orientation: 'landscape',
      },
    };
    // Old monolithic-style usage:
    // html2pdf(documento, opciones);
    // New Promise-based usage:
    // html2pdf().from(documento).set(opciones).save();
    html2pdf()
      .from(documento)
      .set(opciones)
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // Colocamos en el Pie de Pagina # de la pagina
        var totalPages = pdf.internal.getNumberOfPages();
        for (let index = 0; index < totalPages; index++) {
          pdf.setPage(index);
          pdf.setFontSize(10);
          pdf.setTextColor(0);
          console.log(totalPages - index);
          pdf.text(
            'Pagina ' + (totalPages - index) + ' de ' + totalPages,
            pdf.internal.pageSize.getWidth() -
              pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 0.5
          );
        }
      })
      .save();
  }
}
