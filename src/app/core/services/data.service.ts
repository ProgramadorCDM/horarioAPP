import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Objeto donde guardamos el contenido del fichero
  private data: any;

  // Importacion del servicio HttpClient
  constructor(private http: HttpClient) {}

  // Obtenemos la indormacion del fichero JSON
  public getData() {
    return new Promise((resolve, reject) => {
      this.http.get('').subscribe(
        data => {
          this.data = data;
          resolve(true);
        },
        error => {
          console.log('Error al obtener la configuracion: ' + error);
          reject(true);
        }
      );
    });
  }
}
