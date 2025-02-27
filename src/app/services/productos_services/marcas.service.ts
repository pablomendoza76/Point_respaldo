import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',  // Ensures it is provided at the root level
})
export class MarcasService {
  private marcas: any[] = [
    { nombre: 'Marca1', descripcion: 'Descripción de Marca1' },
    { nombre: 'Marca2', descripcion: 'Descripción de Marca2' },
  ];

  constructor() {}

  getMarcas() {
    return this.marcas;
  }
}
