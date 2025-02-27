import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  constructor() {}

  getProveedores() {
    return [
      {
        codigo: '123',
        identificacion: '1234567890',
        tipoDocumento: 'CI/RUC',
        sujeto: 'Natural',
        nombres: 'Juan',
        apellidos: 'Pérez',
        direccion: 'Av. Principal 123',
        tipoProveedor: 'Distribuidor',
        telefono: '0999999999',
        correo: 'juan@example.com',
        correo2: 'juan2@example.com',
        razonSocial: 'Juan Pérez',
        establecimiento: 'Establecimiento 1',
        documento: 'Factura',
        autorizacionSRI: '1234567890',
        puntoEmision: '001',
        fechaCaducidad: '2025-12-31',
        ingresosMensuales: 5000,
        ciudad: 'Quito',
        canton: 'Cantón 1',
        retenciones: [],
        estado: 'Activo'
      },
      // Más proveedores...
    ];
  }

  getColumnas() {
    return [
      { name: 'Identificación', key: 'identificacion', default: true, selected: true },
      { name: 'Nombres', key: 'nombres', default: true, selected: true },
      { name: 'Apellidos', key: 'apellidos', default: true, selected: true },
      { name: 'Dirección', key: 'direccion', default: true, selected: true },
      { name: 'Tipo de Proveedor', key: 'tipoProveedor', default: true, selected: true },
      { name: 'Correo', key: 'correo', default: true, selected: true },
      { name: 'Estado', key: 'estado', default: true, selected: true },
      { name: 'Teléfono', key: 'telefono', default: false, selected: false },
      { name: 'Razón Social', key: 'razonSocial', default: false, selected: false },
    ];
  }

  getTiposProveedor() {
    return ['Distribuidor', 'Mayorista', 'Minorista'];
  }

  getRetenciones() {
    return [
      { codigo: '001', descripcion: 'Retención 1' },
      { codigo: '002', descripcion: 'Retención 2' },
      // Más retenciones...
    ];
  }
}