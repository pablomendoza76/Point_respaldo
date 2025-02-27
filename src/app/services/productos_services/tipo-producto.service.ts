import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible en toda la aplicación
})
export class TipoProductoService {
  constructor() {}

  // Método para obtener los tipos de productos
  getTiposProductos() {
    return [
      {
        nombre: 'Activo',
        descripcion: 'Se pueden recibir, distribuir o fabricar. Sin embargo, su nivel de existencias no está gestionado por el sistema.',
        estado: 'Inactivo',
        visible: 'Activado',
        codigoSustento: '1',
      },
      {
        nombre: 'Inventario',
        descripcion: 'Se definen de este tipo los productos cuya reposición debe ser menos automatizada.',
        estado: 'Activado',
        visible: 'Activado',
        codigoSustento: '1',
      },
      {
        nombre: 'Servicio',
        descripcion: 'Sin control de stock. No aparecen en las diversas operaciones de almacén.',
        estado: 'Activado',
        visible: 'Activado',
        codigoSustento: '1',
      },
      {
        nombre: 'Super producto',
        descripcion: 'Sin control de stock. Se utiliza cuando se crea un superproducto que tiene asociado varios subproductos.',
        estado: 'Activado',
        visible: 'Activado',
        codigoSustento: '1',
      },
    ];
  }

  // Método para agregar un nuevo tipo de producto
  agregarTipoProducto(nuevoTipo: any) {
    const tipos = this.getTiposProductos();
    tipos.push(nuevoTipo);
    // Aquí podrías guardar los datos en una base de datos o en un backend
    return tipos;
  }

  // Método para actualizar un tipo de producto existente
  actualizarTipoProducto(tipoActualizado: any) {
    const tipos = this.getTiposProductos();
    const index = tipos.findIndex(t => t.nombre === tipoActualizado.nombre);
    if (index !== -1) {
      tipos[index] = tipoActualizado;
    }
    // Aquí podrías guardar los datos en una base de datos o en un backend
    return tipos;
  }

  // Método para eliminar un tipo de producto
  eliminarTipoProducto(nombre: string) {
    const tipos = this.getTiposProductos();
    const nuevosTipos = tipos.filter(t => t.nombre !== nombre);
    // Aquí podrías guardar los datos en una base de datos o en un backend
    return nuevosTipos;
  }
}