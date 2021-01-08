/* Angular */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
/* RxJS */
import { Observable } from "rxjs";
/* Modelo */
import { Registro } from "../models/Registro";

@Injectable({
  providedIn: "root"
})
export class RegistroService {
  // URL de donde obtenemos datos de la API_REST
  baseURL: string = "http://152.200.130.126/ebackend/api/registro";
  // baseURL: string = "http://localhost:8090/api/registro";

  /**
   * Constructor del Servicio
   * @param http Importacion del Servicio HTTPCLient
   */
  constructor(private http: HttpClient) {}

  /**
   * Metodo que nos permite listar todos los elementos de la API_REST
   */
  getAll(): Observable<any> {
    return this.http.get(this.baseURL + "/all");
  }

  /**
   * Metodo que nos permite guardar o editar datos de la API_REST
   * @param registro Objeto de tipo Registro enviado a la API_REST para su creacion
   * o edicion atravez del metodo post.
   */
  save(registro: Registro): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json");
    return this.http.post(this.baseURL + "/save", JSON.stringify(registro), {
      headers: headers
    });
  }

  /**
   * Metodo que nos permite cregar un segundo registro en la API_REST
   * @param id Parametro que trae el ID del registro hermano.
   * @param registro Objeto de tipo Registro enviado a la API_REST para su creacion
   */
  segundo(id: number, registro: Registro): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json");
    return this.http.post(
      this.baseURL + "/segundo/" + id,
      JSON.stringify(registro),
      {
        headers: headers
      }
    );
  }

  /**
   * Metodo que elimina un valor de la API_REST
   *
   * @param {number} id Parametro obtenido y enviado a la API_REST
   * @returns {Observable<any>}
   * @memberof RegistroService
   */
  delete(id: number): Observable<any> {
    return this.http.get(this.baseURL + "/delete/" + id);
  }
}
