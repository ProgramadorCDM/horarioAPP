export class Persona {
  /**
   * Creates an instance of Persona.
   * @param {string} [cedula=null]
   * @param {string} [nombre=null]
   * @param {number} [salario=null]
   * @memberof Persona
   */
  constructor(
    public cedula: string = null,
    public nombre: string = null,
    public salario: number = null
  ) {}
}
