import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdministracionServicios {
  constructor() {}

  // Obtener opciones de menú
  getMenuOptions() {
    return [
      'Administración',
      'Proveedores',
      'Tipos PVP',
      'Clientes',
      'Cuentas Contables',
      'Empresa',
      'Configuración'
    ];
  }

  getColumnas() {
    return [
      { name: 'Código', key: 'codigo', default: true, selected: true },
      { name: 'Nombre Único', key: 'nombre', default: true, selected: true },
      { name: 'Descripción', key: 'descripcion', default: true, selected: true },
      { name: 'Stock', key: 'stock', default: true, selected: true },
      { name: 'Stock Mínimo', key: 'stockMinimo', default: true, selected: true },
      { name: 'Stock Máximo', key: 'stockMaximo', default: true, selected: true },
      { name: 'Tipo de Producto', key: 'tipo', default: true, selected: true },
      { name: 'Grupo/Subgrupo', key: 'grupo', default: true, selected: true },
      { name: 'Marca', key: 'marca', default: true, selected: true },
      { name: 'Costo Promocional', key: 'costo_promocional', default: false, selected: false },
      { name: 'Costo Promedio', key: 'costo_promedio', default: false, selected: false },
      { name: 'Precios PA', key: 'precio_pa', default: false, selected: false },
      { name: 'Precios PB', key: 'precio_pb', default: false, selected: false },
      { name: 'Precios PC', key: 'precio_pc', default: false, selected: false },
      { name: 'Inventario Producto', key: 'inventario', default: false, selected: false },
      { name: 'Fecha de Caducidad', key: 'fecha_caducidad', default: false, selected: false },
      { name: 'Rentabilidad', key: 'rentabilidad', default: false, selected: false },
      { name: 'Bodega', key: 'bodega', default: false, selected: false }
    ];
  }
getProductos() {
    return [
      {
        codigo: 84618,
        estado: 'activo',
        nombre: 'TRAIDEN SS FRESA X18',
        descripcion: 'Traiden 5s Fresa x18',
        stock: 1000,
        stockMinimo: 10,
        stockMaximo: 1000,
        tipo: 'Inventario',
        grupo: 'Nestle',
        subGrupo: 'Confitería',
        marca: 'Magi',
        codigoBarras1: '1234567890123',
        codigoBarras2: '',
        codigoBarras3: '',
        codigoBarras4: '',
        codigoBarras5: '',
        unidadMedida: 'kg',
        origen: 'Nacional',
        fechaCaducidad: '2025-12-31',
        regimen: 'General',
        impuesto: 'IVA - TARIFA 15%',
        precio: {
          pvpA: 5.00,
          pvpB: 4.80,
          pvpC: 4.50,
          pvpD: 4.00,
          pvpE: 3.80
        },
        cuentas: {
          ctaContCosto: '610101',
          ctaContComprasDebe: '110201',
          ctaContVentasHaber: '410101'
        },
        descuento: true,
        especificaciones: true
      },
      {
        codigo: 85618,
        estado: 'activo',
        nombre: 'TRAIDEN SS MENTA X18',
        descripcion: 'Traiden 5s MENTA x18',
        stock: 50,
        stockMinimo: 10,
        stockMaximo: 1000,
        tipo: 'Inventario',
        grupo: 'Nestle',
        subGrupo: 'Confitería',
        marca: 'CONDIMENZA',
        codigoBarras1: '1234567890124',
        codigoBarras2: '',
        codigoBarras3: '',
        codigoBarras4: '',
        codigoBarras5: '',
        unidadMedida: 'kg',
        origen: 'Importado',
        fechaCaducidad: '2026-06-15',
        regimen: 'General',
        impuesto: 'IVA - TARIFA CERO 0%',
        precio: {
          pvpA: 5.00,
          pvpB: 4.80,
          pvpC: 4.50,
          pvpD: 4.00,
          pvpE: 3.80
        },
        cuentas: {
          ctaContCosto: '610102',
          ctaContComprasDebe: '110202',
          ctaContVentasHaber: '410102'
        },
        descuento: false,
        especificaciones: true
      },
      {
        codigo: 84625,
        estado: 'activo',
        nombre: 'SOMETHING ESPECIAL',
        descripcion: 'Something special',
        stock: 4000,
        stockMinimo: 10,
        stockMaximo: 1000,
        tipo: 'Inventario',
        grupo: 'Nestle',
        subGrupo: 'Bebidas',
        marca: 'Rancherito',
        codigoBarras1: '1234567890125',
        codigoBarras2: '',
        codigoBarras3: '',
        codigoBarras4: '',
        codigoBarras5: '',
        unidadMedida: 'L',
        origen: 'Nacional',
        fechaCaducidad: '2026-01-01',
        regimen: 'Simplificado',
        impuesto: 'IVA - TARIFA QUINCE 15%',
        precio: {
          pvpA: 10.00,
          pvpB: 9.50,
          pvpC: 9.00,
          pvpD: 8.50,
          pvpE: 8.00
        },
        cuentas: {
          ctaContCosto: '610103',
          ctaContComprasDebe: '110203',
          ctaContVentasHaber: '410103'
        },
        descuento: false,
        especificaciones: false
      },
      {
        codigo: 84626,
        estado: 'activo',
        nombre: 'QUESO MOZARELLA',
        descripcion: 'Queso Mozarella 300G',
        stock: 0,
        stockMinimo: 10,
        stockMaximo: 1000,
        tipo: 'Inventario',
        grupo: 'Lácteos',
        subGrupo: 'Quesos',
        marca: 'Lactalis',
        codigoBarras1: '1234567890126',
        codigoBarras2: '',
        codigoBarras3: '',
        codigoBarras4: '',
        codigoBarras5: '',
        unidadMedida: 'kg',
        origen: 'Nacional',
        fechaCaducidad: '2025-08-10',
        regimen: 'General',
        impuesto: 'IVA - NO OBJETO DE IMPUESTOS 0%',
        precio: {
          pvpA: 8.00,
          pvpB: 7.50,
          pvpC: 7.00,
          pvpD: 6.50,
          pvpE: 6.00
        },
        cuentas: {
          ctaContCosto: '610104',
          ctaContComprasDebe: '110204',
          ctaContVentasHaber: '410104'
        },
        descuento: false,
        especificaciones: true
      }
    ];
  }
  
  
  // Obtener grupos de productos
  getGrupos() {
    return ['Nestle', 'Lácteos', 'Pepsico' ];
  }

  // Obtener subgrupos de productos
  getSubGrupos() {
    return ['Confitería', 'Bebidas', 'Lácteos', 'Carnes'];
  }

  // Obtener marcas de productos
  getMarcas() {
    return ['Magi', 'Rancherito', 'Lactalis'];
  }

  // Obtener tipos de producto
  getTiposProducto() {
    return ['Inventario', 'Servicio', 'Activo'];
  }

  // Obtener origen de los productos
  getOrigenes() {
    return ['Nacional', 'Importado'];
  }

  // Obtener los diferentes regímenes fiscales
  getRegimenes() {
    return ['General', 'Simplificado'];
  }

  // Obtener ICEs disponibles
  getICES() {
    return ['0%', '10%', '20%'];
  }

  // Obtener cuentas contables disponibles
  getCuentas() {
    return [
      '610101 - Costo de Venta',
      '110201 - Compras',
      '410101 - Ventas',
      '110202 - Inventarios',
      '110203 - Activos Fijos'
    ];
  }
}
