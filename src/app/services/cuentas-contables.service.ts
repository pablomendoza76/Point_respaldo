import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CuentasContablesService {
  // Datos simulados de cuentas contables
  private cuentasContables: any[] = [
    {
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },
    {
      codigo: 'CR002',
      nombre: 'Cuenta de Retención 2',
      descripcion: 'Descripción de la cuenta 2',
      debe: 2000,
      haber: 1000,
      cuentaContable: 'Cuenta 2',
      estado: 'Inactivo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },{
      codigo: 'CR001',
      nombre: 'Cuenta de Retención 1',
      descripcion: 'Descripción de la cuenta 1',
      debe: 1000,
      haber: 500,
      cuentaContable: 'Cuenta 1',
      estado: 'Activo',
    },
  ];

  // Opciones dinámicas para el formulario
  private cuentasContablesOptions = ['Cuenta 1', 'Cuenta 2', 'Cuenta 3'];
  private estados = ['Activo', 'Inactivo'];

  constructor() {}

  // Métodos para obtener datos

  /**
   * Obtiene todas las cuentas contables.
   */
  getCuentasContables(): any[] {
    return this.cuentasContables;
  }

  /**
   * Agrega una nueva cuenta contable.
   */
  agregarCuentaContable(nuevaCuenta: any): any[] {
    this.cuentasContables.push(nuevaCuenta);
    return this.cuentasContables;
  }

  /**
   * Actualiza una cuenta contable existente.
   */
  actualizarCuentaContable(cuentaActualizada: any): any[] {
    const index = this.cuentasContables.findIndex((c) => c.codigo === cuentaActualizada.codigo);
    if (index !== -1) {
      this.cuentasContables[index] = cuentaActualizada;
    }
    return this.cuentasContables;
  }

  /**
   * Elimina una cuenta contable.
   */
  eliminarCuentaContable(codigo: string): any[] {
    this.cuentasContables = this.cuentasContables.filter((c) => c.codigo !== codigo);
    return this.cuentasContables;
  }

  // Métodos para obtener opciones dinámicas

  /**
   * Obtiene las opciones de cuentas contables.
   */
  getCuentasContablesOptions(): string[] {
    return this.cuentasContablesOptions;
  }

  /**
   * Obtiene los estados disponibles.
   */
  getEstados(): string[] {
    return this.estados;
  }
}