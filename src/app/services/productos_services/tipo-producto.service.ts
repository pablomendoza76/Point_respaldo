import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible en toda la aplicación
})
export class TipoProductoService {
  constructor() {}

  // Método para obtener los tipos de productos
  getTiposProductos() {
    return [
      { nombre: 'Activo', descripcion: 'Se pueden recibir, distribuir o fabricar. Sin embargo, su nivel de existencias no está gestionado por el sistema.', estado: 'Inactivo', visible: 'Activado', codigoSustento: '1' },
      { nombre: 'Inventario', descripcion: 'Se definen de este tipo los productos cuya reposición debe ser menos automatizada.', estado: 'Activado', visible: 'Activado', codigoSustento: '1' },
      { nombre: 'Servicio', descripcion: 'Sin control de stock. No aparecen en las diversas operaciones de almacén.', estado: 'Activado', visible: 'Activado', codigoSustento: '1' },
      { nombre: 'Super producto', descripcion: 'Sin control de stock. Se utiliza cuando se crea un superproducto que tiene asociado varios subproductos.', estado: 'Activado', visible: 'Activado', codigoSustento: '1' },
      { nombre: 'Materia Prima', descripcion: 'Productos utilizados en la fabricación de otros productos.', estado: 'Activado', visible: 'Activado', codigoSustento: '2' },
      { nombre: 'Producto Terminado', descripcion: 'Productos listos para la venta o distribución.', estado: 'Activado', visible: 'Activado', codigoSustento: '2' },
      { nombre: 'Producto Semielaborado', descripcion: 'Productos en fase de fabricación que requieren más procesos.', estado: 'Inactivo', visible: 'Desactivado', codigoSustento: '2' },
      { nombre: 'Repuestos', descripcion: 'Piezas y accesorios utilizados para mantenimiento de equipos.', estado: 'Activado', visible: 'Activado', codigoSustento: '3' },
      { nombre: 'Herramientas', descripcion: 'Instrumentos utilizados para trabajos mecánicos o manuales.', estado: 'Activado', visible: 'Activado', codigoSustento: '3' },
      { nombre: 'Insumos', descripcion: 'Materiales utilizados en procesos de producción y mantenimiento.', estado: 'Activado', visible: 'Activado', codigoSustento: '3' },
      { nombre: 'Embalajes', descripcion: 'Materiales utilizados para el empaque y transporte de productos.', estado: 'Inactivo', visible: 'Desactivado', codigoSustento: '4' },
      { nombre: 'Equipos de Protección', descripcion: 'Elementos de seguridad utilizados en procesos industriales.', estado: 'Activado', visible: 'Activado', codigoSustento: '4' },
      { nombre: 'Software', descripcion: 'Programas y licencias utilizadas en operaciones de la empresa.', estado: 'Activado', visible: 'Activado', codigoSustento: '5' },
      { nombre: 'Maquinaria', descripcion: 'Equipos utilizados para la producción y operaciones industriales.', estado: 'Inactivo', visible: 'Desactivado', codigoSustento: '5' },
      { nombre: 'Publicidad y Promoción', descripcion: 'Material de marketing y campañas publicitarias.', estado: 'Activado', visible: 'Activado', codigoSustento: '6' },
      { nombre: 'Productos de Consumo', descripcion: 'Productos destinados a ser consumidos directamente.', estado: 'Activado', visible: 'Activado', codigoSustento: '6' },
      { nombre: 'Papelería y Oficina', descripcion: 'Materiales de oficina y útiles de escritorio.', estado: 'Activado', visible: 'Activado', codigoSustento: '6' },
      { nombre: 'Mobiliario', descripcion: 'Muebles y equipos utilizados en oficinas y establecimientos.', estado: 'Inactivo', visible: 'Desactivado', codigoSustento: '7' },
      { nombre: 'Vehículos', descripcion: 'Automóviles y transportes utilizados en la empresa.', estado: 'Activado', visible: 'Activado', codigoSustento: '7' },
      { nombre: 'Bienes Raíces', descripcion: 'Propiedades inmobiliarias registradas en la empresa.', estado: 'Inactivo', visible: 'Desactivado', codigoSustento: '7' }
    ];
  }

  // Método para agregar un nuevo tipo de producto
  agregarTipoProducto(nuevoTipo: any) {
    const tipos = this.getTiposProductos();
    tipos.push(nuevoTipo);
    return tipos;
  }

  // Método para actualizar un tipo de producto existente
  actualizarTipoProducto(tipoActualizado: any) {
    const tipos = this.getTiposProductos();
    const index = tipos.findIndex(t => t.nombre === tipoActualizado.nombre);
    if (index !== -1) {
      tipos[index] = tipoActualizado;
    }
    return tipos;
  }

  // Método para eliminar un tipo de producto
  eliminarTipoProducto(nombre: string) {
    const tipos = this.getTiposProductos();
    return tipos.filter(t => t.nombre !== nombre);
  }
}
