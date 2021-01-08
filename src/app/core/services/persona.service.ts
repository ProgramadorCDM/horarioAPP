// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
// RxJS
import { Observable } from "rxjs";
// Modelo
import { Persona } from "src/app/models/Persona";

/**
 * Direccion base de la API_REST
 */
const API_URL: String = "http://152.200.130.126/ebackend/api/persona/";
// const API_URL: String = "http://localhost:8090/api/persona/";

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  
/**
 * Constructor del Servicio
 * @param http Importacion del Servicio HTTPClient
 */
  constructor(private http: HttpClient) { }

  /**
   * Metodo que nos permite listar todos los elementos de la API_REST
   */
  getAll(): Observable<any>{
    return this.http.get(API_URL + "all");
  }

  /**
   * Metodo que nos permite guardar o editar datos de la API_REST
   * @param persona Objeto de tipo Persona enviado a la API_REST para su creacion
   * o edicion atravez del metodo post.
   */
  save (persona: Persona): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json")
    return this.http.post(API_URL + "save", JSON.stringify(persona), {
      headers: headers
    });
  }
  
  /**
   * Metodo que elimina un valor de la API_REST
   * @param id Parametro obtenido y enviado a la API_REST
   */
  delete(id: string): Observable<any>{
    return this.http.get(API_URL + "delete/" +id);
  }

}
