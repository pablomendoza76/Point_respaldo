import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Disponible en toda la aplicación
})
export class TipoProveedoresService {
  // Datos de ejemplo para tipos de proveedores
  private tiposProveedores: any[] = [
    {
      tipo: 'Proveedor Nacional',
      descripcion: 'Proveedores que operan dentro del país.',
    },
    {
      tipo: 'Proveedor Internacional',
      descripcion: 'Proveedores que operan fuera del país.',
    },
  ];

  constructor() {}

  // Método para obtener todos los tipos de proveedores
  getTiposProveedores(): any[] {
    return this.tiposProveedores;
  }

  // Método para agregar un nuevo tipo de proveedor
  agregarTipoProveedor(nuevoTipo: any): any[] {
    this.tiposProveedores.push(nuevoTipo);
    return this.tiposProveedores;
  }

  // Método para actualizar un tipo de proveedor existente
  actualizarTipoProveedor(tipoActualizado: any): any[] {
    const index = this.tiposProveedores.findIndex(
      (t) => t.tipo === tipoActualizado.tipo
    );
    if (index !== -1) {
      this.tiposProveedores[index] = tipoActualizado;
    }
    return this.tiposProveedores;
  }

  // Método para eliminar un tipo de proveedor
  eliminarTipoProveedor(tipo: string): any[] {
    this.tiposProveedores = this.tiposProveedores.filter(
      (t) => t.tipo !== tipo
    );
    return this.tiposProveedores;
  }
}