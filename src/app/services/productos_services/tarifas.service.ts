import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TarifasService {
  private grupos: any[] = [
    { codigo: 1, nombre: 'GASTOS', descripcion: 'Categoría de gastos generales', garantia: 1, orden: 1, vistaWeb: false, vistaSistema: false, parent: true, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 1, descuento: 1 },
      { tipo: 'P.V.P B', utilidad: 1, descuento: 1 },
      { tipo: 'P.V.P C', utilidad: 1, descuento: 1 }
    ]},
    { codigo: 2, nombre: 'FT', descripcion: 'Facturación y tributos', garantia: 2, orden: 2, vistaWeb: false, vistaSistema: false, parent: true, estado: 'Inactivo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 2, descuento: 2 },
      { tipo: 'P.V.P B', utilidad: 2, descuento: 2 },
      { tipo: 'P.V.P C', utilidad: 2, descuento: 2 }
    ]},
    { codigo: 3, nombre: 'SUPAN', descripcion: 'Supermercado de alimentos', garantia: 3, orden: 3, vistaWeb: true, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 3, descuento: 3 },
      { tipo: 'P.V.P B', utilidad: 3, descuento: 3 },
      { tipo: 'P.V.P C', utilidad: 3, descuento: 3 }
    ]},
    { codigo: 4, nombre: 'BEBIDAS', descripcion: 'Bebidas alcohólicas y no alcohólicas', garantia: 4, orden: 4, vistaWeb: true, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 4, descuento: 4 },
      { tipo: 'P.V.P B', utilidad: 4, descuento: 4 },
      { tipo: 'P.V.P C', utilidad: 4, descuento: 4 }
    ]},
    { codigo: 5, nombre: 'ELECTRÓNICA', descripcion: 'Equipos electrónicos y accesorios', garantia: 12, orden: 5, vistaWeb: true, vistaSistema: true, parent: false, estado: 'Inactivo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 5, descuento: 5 },
      { tipo: 'P.V.P B', utilidad: 5, descuento: 5 },
      { tipo: 'P.V.P C', utilidad: 5, descuento: 5 }
    ]},
    { codigo: 6, nombre: 'ROPA', descripcion: 'Moda y vestimenta', garantia: 6, orden: 6, vistaWeb: true, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 6, descuento: 6 },
      { tipo: 'P.V.P B', utilidad: 6, descuento: 6 },
      { tipo: 'P.V.P C', utilidad: 6, descuento: 6 }
    ]},
    { codigo: 7, nombre: 'MUEBLES', descripcion: 'Muebles para el hogar y oficina', garantia: 24, orden: 7, vistaWeb: true, vistaSistema: false, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 7, descuento: 7 },
      { tipo: 'P.V.P B', utilidad: 7, descuento: 7 },
      { tipo: 'P.V.P C', utilidad: 7, descuento: 7 }
    ]},
    { codigo: 8, nombre: 'FARMACIA', descripcion: 'Productos farmacéuticos y salud', garantia: 8, orden: 8, vistaWeb: false, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 8, descuento: 8 },
      { tipo: 'P.V.P B', utilidad: 8, descuento: 8 },
      { tipo: 'P.V.P C', utilidad: 8, descuento: 8 }
    ]},
    { codigo: 9, nombre: 'JUGUETES', descripcion: 'Juguetes y entretenimiento', garantia: 9, orden: 9, vistaWeb: true, vistaSistema: false, parent: false, estado: 'Inactivo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 9, descuento: 9 },
      { tipo: 'P.V.P B', utilidad: 9, descuento: 9 },
      { tipo: 'P.V.P C', utilidad: 9, descuento: 9 }
    ]},
    { codigo: 10, nombre: 'HERRAMIENTAS', descripcion: 'Herramientas de construcción y mecánica', garantia: 10, orden: 10, vistaWeb: false, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P B', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P C', utilidad: 10, descuento: 10 }
    ]},
    { codigo: 10, nombre: 'HERRAMIENTAS', descripcion: 'Herramientas de construcción y mecánica', garantia: 10, orden: 10, vistaWeb: false, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P B', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P C', utilidad: 10, descuento: 10 }
    ]},
    { codigo: 10, nombre: 'HERRAMIENTAS', descripcion: 'Herramientas de construcción y mecánica', garantia: 10, orden: 10, vistaWeb: false, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P B', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P C', utilidad: 10, descuento: 10 }
    ]},
    { codigo: 10, nombre: 'HERRAMIENTAS', descripcion: 'Herramientas de construcción y mecánica', garantia: 10, orden: 10, vistaWeb: false, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P B', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P C', utilidad: 10, descuento: 10 }
    ]},
    { codigo: 10, nombre: 'HERRAMIENTAS', descripcion: 'Herramientas de construcción y mecánica', garantia: 10, orden: 10, vistaWeb: false, vistaSistema: true, parent: false, estado: 'Activo', tarifas: [
      { tipo: 'P.V.P A', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P B', utilidad: 10, descuento: 10 },
      { tipo: 'P.V.P C', utilidad: 10, descuento: 10 }
    ]}
  ];

  constructor() {}

  getGrupos() {
    return this.grupos;
  }

  agregarGrupo(grupo: any) {
    this.grupos.push(grupo);
  }

  eliminarGrupo(codigo: number) {
    this.grupos = this.grupos.filter(g => g.codigo !== codigo);
  }

  actualizarGrupo(grupo: any) {
    const index = this.grupos.findIndex(g => g.codigo === grupo.codigo);
    if (index !== -1) {
      this.grupos[index] = grupo;
    }
  }
}
