import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TipoClientesService {
  // Datos simulados de tipos de clientes
  private tiposClientes: any[] = [
    {
      tipo: 'Cliente Regular',
      descripcion: 'Clientes que realizan compras frecuentes.',
      descuento: 10,
      codigoPais: '+593',
      numeroPersonal: '0991234567',
      tipoGarantia: 'Garantía A',
      cuentaContable: 'Cuenta 1',
      precio: 100.0,
      pvpDefecto: 'p.A',
      pvp: 'P.V.P 1',
      productoDefecto: 'Producto A',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    },
    {
      tipo: 'Cliente VIP',
      descripcion: 'Clientes con beneficios exclusivos.',
      descuento: 20,
      codigoPais: '+593',
      numeroPersonal: '0997654321',
      tipoGarantia: 'Garantía B',
      cuentaContable: 'Cuenta 2',
      precio: 150.0,
      pvpDefecto: 'p.B',
      pvp: 'P.V.P 2',
      productoDefecto: 'Producto B',
      factLotes: 'Inactivo',
      permiteEliminacion: 'Inactivo',
    },{
      tipo: 'Cliente Regular',
      descripcion: 'Clientes que realizan compras frecuentes.',
      descuento: 10,
      codigoPais: '+593',
      numeroPersonal: '0991234567',
      tipoGarantia: 'Garantía A',
      cuentaContable: 'Cuenta 1',
      precio: 100.0,
      pvpDefecto: 'p.A',
      pvp: 'P.V.P 1',
      productoDefecto: 'Producto A',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    },
    {
      tipo: 'Cliente VIP',
      descripcion: 'Clientes con beneficios exclusivos.',
      descuento: 20,
      codigoPais: '+593',
      numeroPersonal: '0997654321',
      tipoGarantia: 'Garantía B',
      cuentaContable: 'Cuenta 2',
      precio: 150.0,
      pvpDefecto: 'p.B',
      pvp: 'P.V.P 2',
      productoDefecto: 'Producto B',
      factLotes: 'Inactivo',
      permiteEliminacion: 'Inactivo',
    },{
      tipo: 'Cliente Regular',
      descripcion: 'Clientes que realizan compras frecuentes.',
      descuento: 10,
      codigoPais: '+593',
      numeroPersonal: '0991234567',
      tipoGarantia: 'Garantía A',
      cuentaContable: 'Cuenta 1',
      precio: 100.0,
      pvpDefecto: 'p.A',
      pvp: 'P.V.P 1',
      productoDefecto: 'Producto A',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    },
    {
      tipo: 'Cliente VIP',
      descripcion: 'Clientes con beneficios exclusivos.',
      descuento: 20,
      codigoPais: '+593',
      numeroPersonal: '0997654321',
      tipoGarantia: 'Garantía B',
      cuentaContable: 'Cuenta 2',
      precio: 150.0,
      pvpDefecto: 'p.B',
      pvp: 'P.V.P 2',
      productoDefecto: 'Producto B',
      factLotes: 'Inactivo',
      permiteEliminacion: 'Inactivo',
    },{
      tipo: 'Cliente Regular',
      descripcion: 'Clientes que realizan compras frecuentes.',
      descuento: 10,
      codigoPais: '+593',
      numeroPersonal: '0991234567',
      tipoGarantia: 'Garantía A',
      cuentaContable: 'Cuenta 1',
      precio: 100.0,
      pvpDefecto: 'p.A',
      pvp: 'P.V.P 1',
      productoDefecto: 'Producto A',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    },
    {
      tipo: 'Cliente VIP',
      descripcion: 'Clientes con beneficios exclusivos.',
      descuento: 20,
      codigoPais: '+593',
      numeroPersonal: '0997654321',
      tipoGarantia: 'Garantía B',
      cuentaContable: 'Cuenta 2',
      precio: 150.0,
      pvpDefecto: 'p.B',
      pvp: 'P.V.P 2',
      productoDefecto: 'Producto B',
      factLotes: 'Inactivo',
      permiteEliminacion: 'Inactivo',
    },{
      tipo: 'Cliente Regular',
      descripcion: 'Clientes que realizan compras frecuentes.',
      descuento: 10,
      codigoPais: '+593',
      numeroPersonal: '0991234567',
      tipoGarantia: 'Garantía A',
      cuentaContable: 'Cuenta 1',
      precio: 100.0,
      pvpDefecto: 'p.A',
      pvp: 'P.V.P 1',
      productoDefecto: 'Producto A',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    },
    {
      tipo: 'Cliente VIP',
      descripcion: 'Clientes con beneficios exclusivos.',
      descuento: 20,
      codigoPais: '+593',
      numeroPersonal: '0997654321',
      tipoGarantia: 'Garantía B',
      cuentaContable: 'Cuenta 2',
      precio: 150.0,
      pvpDefecto: 'p.B',
      pvp: 'P.V.P 2',
      productoDefecto: 'Producto B',
      factLotes: 'Inactivo',
      permiteEliminacion: 'Inactivo',
    },{
      tipo: 'Cliente Regular',
      descripcion: 'Clientes que realizan compras frecuentes.',
      descuento: 10,
      codigoPais: '+593',
      numeroPersonal: '0991234567',
      tipoGarantia: 'Garantía A',
      cuentaContable: 'Cuenta 1',
      precio: 100.0,
      pvpDefecto: 'p.A',
      pvp: 'P.V.P 1',
      productoDefecto: 'Producto A',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    },
    {
      tipo: 'Cliente VIP',
      descripcion: 'Clientes con beneficios exclusivos.',
      descuento: 20,
      codigoPais: '+593',
      numeroPersonal: '0997654321',
      tipoGarantia: 'Garantía B',
      cuentaContable: 'Cuenta 2',
      precio: 150.0,
      pvpDefecto: 'p.B',
      pvp: 'P.V.P 2',
      productoDefecto: 'Producto B',
      factLotes: 'Inactivo',
      permiteEliminacion: 'Inactivo',
    },{
      tipo: 'Cliente Regular',
      descripcion: 'Clientes que realizan compras frecuentes.',
      descuento: 10,
      codigoPais: '+593',
      numeroPersonal: '0991234567',
      tipoGarantia: 'Garantía A',
      cuentaContable: 'Cuenta 1',
      precio: 100.0,
      pvpDefecto: 'p.A',
      pvp: 'P.V.P 1',
      productoDefecto: 'Producto A',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    },
    {
      tipo: 'Cliente VIP',
      descripcion: 'Clientes con beneficios exclusivos.',
      descuento: 20,
      codigoPais: '+593',
      numeroPersonal: '0997654321',
      tipoGarantia: 'Garantía B',
      cuentaContable: 'Cuenta 2',
      precio: 150.0,
      pvpDefecto: 'p.B',
      pvp: 'P.V.P 2',
      productoDefecto: 'Producto B',
      factLotes: 'Inactivo',
      permiteEliminacion: 'Inactivo',
    },{
      tipo: 'Cliente Regular',
      descripcion: 'Clientes que realizan compras frecuentes.',
      descuento: 10,
      codigoPais: '+593',
      numeroPersonal: '0991234567',
      tipoGarantia: 'Garantía A',
      cuentaContable: 'Cuenta 1',
      precio: 100.0,
      pvpDefecto: 'p.A',
      pvp: 'P.V.P 1',
      productoDefecto: 'Producto A',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    },
    {
      tipo: 'Cliente VIP',
      descripcion: 'Clientes con beneficios exclusivos.',
      descuento: 20,
      codigoPais: '+593',
      numeroPersonal: '0997654321',
      tipoGarantia: 'Garantía B',
      cuentaContable: 'Cuenta 2',
      precio: 150.0,
      pvpDefecto: 'p.B',
      pvp: 'P.V.P 2',
      productoDefecto: 'Producto B',
      factLotes: 'Inactivo',
      permiteEliminacion: 'Inactivo',
    },
  ];

  // Opciones dinámicas para el formulario
  private tiposGarantia = ['Garantía A', 'Garantía B', 'Garantía C'];
  private cuentasContables = ['Cuenta 1', 'Cuenta 5', 'Cuenta 3'];
  private tiposPvp = ['P.V.P 8', 'P.V.P 2', 'P.V.P 3'];
  private opcionesFactLotes = ['Activo', 'Inactivo'];
  private opcionesPermitirEliminacion = ['Activo', 'Inactivo'];

  constructor() {}
  getTiposClientes(): any[] {
    return this.tiposClientes;
  }

  /**
   * Agrega un nuevo tipo de cliente.
   */
  agregarTipoCliente(nuevoTipo: any): any[] {
    this.tiposClientes.push(nuevoTipo);
    return this.tiposClientes;
  }

  /**
   * Actualiza un tipo de cliente existente.
   */
  actualizarTipoCliente(tipoActualizado: any): any[] {
    const index = this.tiposClientes.findIndex((t) => t.tipo === tipoActualizado.tipo);
    if (index !== -1) {
      this.tiposClientes[index] = tipoActualizado;
    }
    return this.tiposClientes;
  }

  /**
   * Elimina un tipo de cliente.
   */
  eliminarTipoCliente(tipo: string): any[] {
    this.tiposClientes = this.tiposClientes.filter((t) => t.tipo !== tipo);
    return this.tiposClientes;
  }

  // Métodos para obtener opciones dinámicas

  /**
   * Obtiene los tipos de garantía disponibles.
   */
  getTiposGarantia(): string[] {
    return this.tiposGarantia;
  }

  /**
   * Obtiene las cuentas contables disponibles.
   */
  getCuentasContables(): string[] {
    return this.cuentasContables;
  }

  /**
   * Obtiene los tipos de PVP disponibles.
   */
  getTiposPvp(): string[] {
    return this.tiposPvp;
  }

  /**
   * Obtiene las opciones de facturación de lotes.
   */
  getOpcionesFactLotes(): string[] {
    return this.opcionesFactLotes;
  }

  /**
   * Obtiene las opciones para permitir la eliminación de clientes.
   */
  getOpcionesPermitirEliminacion(): string[] {
    return this.opcionesPermitirEliminacion;
  }
}
