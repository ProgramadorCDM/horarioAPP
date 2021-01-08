import { Persona } from "./Persona";
import { Proyecto } from "./Proyecto";

export class Registro {
  /**
   *Creates an instance of Registro.
   * @param {number} [id=null]
   * @param {Date} [fecha=null]
   * @param {Date} [hora_entrada=null]
   * @param {Date} [hora_salida=null]
   * @param {number} [hora_ordinaria=null]
   * @param {number} [recargo_nocturno=null]
   * @param {number} [hora_extra=null]
   * @param {number} [hora_extra_nocturna=null]
   * @param {number} [hora_extra_festiva=null]
   * @param {number} [hora_extra_festiva_nocturna=null]
   * @param {Array<Persona>} [persona=null]
   * @param {Array<Proyecto>} [proyecto=null]
   * @param {boolean} [festivo=false]
   * @param {number} [salario_con_prestaciones=null]
   * @param {number} [salario_sin_prestaciones=null]
   * @memberof Registro
   */
  constructor(
    public id: number=null,
    public fecha: Date = null,
    public hora_entrada: Date = null,
    public hora_salida: Date = null,
    public hora_ordinaria: number = null,
    public recargo_nocturno: number = null,
    public hora_extra: number = null,
    public hora_extra_nocturna: number = null,
    public hora_extra_festiva: number = null,
    public hora_extra_festiva_nocturna: number = null,
    public persona: Array<Persona> = null,
    public proyecto: Array<Proyecto> = null,
    public festivo: boolean = false,
    public salario_con_prestaciones: number = null,
    public salario_sin_prestaciones: number= null,
    public actividad: string = null,
    public users: string = null
  ) {}
}
