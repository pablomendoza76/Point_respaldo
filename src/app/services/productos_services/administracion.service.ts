import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdministracionServicios {
  constructor() {}

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
      ...Array.from({ length: 14 }, (_, i) => ({
        codigo: 84618 + i,
        estado: 'activo',
        nombre: `Producto ${i + 1}`,
        descripcion: `Descripción del producto ${i + 1}`,
        stock: Math.floor(Math.random() * 1000),
        stockMinimo: 10,
        stockMaximo: 1000,
        tipo: ['Inventario', 'Servicio', 'Activo'][i % 3],
        grupo: ['Nestle', 'Lácteos', 'Pepsico', 'Carnes'][i % 4],
        subGrupo: ['Confitería', 'Bebidas', 'Quesos', 'Cárnicos'][i % 4],
        marca: ['Magi', 'Rancherito', 'Lactalis', 'Otra'][i % 4],
        codigoBarras1: `12345678901${i}`,
        codigoBarras2: '',
        codigoBarras3: '',
        codigoBarras4: '',
        codigoBarras5: '',
        unidadMedida: ['kg', 'L', 'unidad'][i % 3],
        origen: ['Nacional', 'Importado'][i % 2],
        fechaCaducidad: `202${6 - (i % 5)}-0${(i % 9) + 1}-15`,
        regimen: ['General', 'Simplificado'][i % 2],
        impuesto: ['IVA - TARIFA 15%', 'IVA - TARIFA 0%'][i % 2],
        precio: {
          pvpA: (5 + i).toFixed(2),
          pvpB: (4.8 + i).toFixed(2),
          pvpC: (4.5 + i).toFixed(2),
          pvpD: (4.0 + i).toFixed(2),
          pvpE: (3.8 + i).toFixed(2)
        },
        cuentas: {
          ctaContCosto: `61010${i % 5}`,
          ctaContComprasDebe: `11020${i % 5}`,
          ctaContVentasHaber: `41010${i % 5}`
        },
        descuento: i % 2 === 0,
        especificaciones: i % 2 !== 0
      }))
    ];
  }

  getGrupos() {
    return ['Nestle', 'Lácteos', 'Pepsico', 'Carnes'];
  }

  getSubGrupos() {
    return ['Confitería', 'Bebidas', 'Quesos', 'Cárnicos'];
  }

  getMarcas() {
    return ['Magi', 'Rancherito', 'Lactalis', 'Otra'];
  }

  getTiposProducto() {
    return ['Inventario', 'Servicio', 'Activo'];
  }

  getOrigenes() {
    return ['Nacional', 'Importado'];
  }

  getRegimenes() {
    return ['General', 'Simplificado'];
  }

  getICES() {
    return ['0%', '10%', '20%'];
  }

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
