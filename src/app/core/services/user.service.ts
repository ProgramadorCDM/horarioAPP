import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_URL } from 'src/environments/environment';

/**
 * Direccion base de la API_REST
 */
const URL: String = `${API_URL}/test/`;

/**
 * Servicio de prueba de la autenticacion AWT de la API_REST
 *
 * @export
 * @class UserService
 */
@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}

  getPublicContent(): Observable<any> {
    return this.http.get(URL + "all", { responseType: "text" });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(URL + "user", { responseType: "text" });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(URL + "mod", { responseType: "text" });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(URL + "admin", { responseType: "text" });
  }
}
