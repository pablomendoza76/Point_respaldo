import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlanCuentasService {
  // Datos simulados de planes de cuentas
  private planesCuentas: any[] = [
    {
      codigo: 'PC001',
      nombre: 'Activo Corriente',
      seccion: 'Activos',
      formula: '',
      tipo: 'Activo',
      parent: '',
      visible: true,
      detalle: false,
    },
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },,
    {
      codigo: 'PC002',
      nombre: 'Pasivo Corriente',
      seccion: 'Pasivos',
      formula: '',
      tipo: 'Pasivo',
      parent: '',
      visible: true,
      detalle: false,
    },
  ];

  // Opciones dinámicas
  private cuentasPadre: any[] = [
    { codigo: 'PC001', nombre: 'Activo Corriente' },
    { codigo: 'PC002', nombre: 'Pasivo Corriente' },
  ];

  constructor() {}

  // Obtener todos los planes de cuentas
  getPlanesCuentas(): any[] {
    return this.planesCuentas;
  }

  // Agregar un nuevo plan de cuentas
  agregarPlanCuenta(nuevoPlan: any): any[] {
    this.planesCuentas.push(nuevoPlan);
    return this.planesCuentas;
  }

  // Actualizar un plan de cuentas existente
  actualizarPlanCuenta(planActualizado: any): any[] {
    const index = this.planesCuentas.findIndex((p) => p.codigo === planActualizado.codigo);
    if (index !== -1) {
      this.planesCuentas[index] = planActualizado;
    }
    return this.planesCuentas;
  }

  // Eliminar un plan de cuentas
  eliminarPlanCuenta(codigo: string): any[] {
    this.planesCuentas = this.planesCuentas.filter((p) => p.codigo !== codigo);
    return this.planesCuentas;
  }

  // Obtener cuentas padre
  getCuentasPadre(): any[] {
    return this.cuentasPadre;
  }
}
