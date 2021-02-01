export class Persona {
  /**
   * Creates an instance of Persona.
   * @param {string} [cedula=null]
   * @param {string} [nombre=null]
   * @param {number} [salario=null]
   * @param {boolean} [activo=null]
   * @memberof Persona
   */
  constructor(
    public cedula: string = null,
    public nombre: string = null,
    public salario: number = null,
    public activo: boolean = null
  ) {}
}
