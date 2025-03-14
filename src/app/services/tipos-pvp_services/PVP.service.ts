import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Disponible en toda la aplicación
})
export class PVPService {
  constructor() {}

  // Método para obtener los tipos de PVP
  getTiposPVP() {
    return [
      {
        tipoPrecio: 'Precio Minorista',
        descripcion: 'Precio para ventas al público en general.',
        alias: 'Minorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Mayorista',
        descripcion: 'Precio para ventas al por mayor.',
        alias: 'Mayorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Promocional',
        descripcion: 'Precio especial para promociones.',
        alias: 'Promocional',
        estado: 'Inactivo',
      },{
        tipoPrecio: 'Precio Minorista',
        descripcion: 'Precio para ventas al público en general.',
        alias: 'Minorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Mayorista',
        descripcion: 'Precio para ventas al por mayor.',
        alias: 'Mayorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Promocional',
        descripcion: 'Precio especial para promociones.',
        alias: 'Promocional',
        estado: 'Inactivo',
      },{
        tipoPrecio: 'Precio Minorista',
        descripcion: 'Precio para ventas al público en general.',
        alias: 'Minorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Mayorista',
        descripcion: 'Precio para ventas al por mayor.',
        alias: 'Mayorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Promocional',
        descripcion: 'Precio especial para promociones.',
        alias: 'Promocional',
        estado: 'Inactivo',
      },{
        tipoPrecio: 'Precio Minorista',
        descripcion: 'Precio para ventas al público en general.',
        alias: 'Minorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Mayorista',
        descripcion: 'Precio para ventas al por mayor.',
        alias: 'Mayorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Promocional',
        descripcion: 'Precio especial para promociones.',
        alias: 'Promocional',
        estado: 'Inactivo',
      },{
        tipoPrecio: 'Precio Minorista',
        descripcion: 'Precio para ventas al público en general.',
        alias: 'Minorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Mayorista',
        descripcion: 'Precio para ventas al por mayor.',
        alias: 'Mayorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Promocional',
        descripcion: 'Precio especial para promociones.',
        alias: 'Promocional',
        estado: 'Inactivo',
      },{
        tipoPrecio: 'Precio Minorista',
        descripcion: 'Precio para ventas al público en general.',
        alias: 'Minorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Mayorista',
        descripcion: 'Precio para ventas al por mayor.',
        alias: 'Mayorista',
        estado: 'Activo',
      },
      {
        tipoPrecio: 'Precio Promocional',
        descripcion: 'Precio especial para promociones.',
        alias: 'Promocional',
        estado: 'Inactivo',
      },
    ];
  }

  // Método para agregar un nuevo tipo de PVP
  agregarTipoPVP(nuevoTipo: any) {
    const tipos = this.getTiposPVP();
    tipos.push(nuevoTipo);
    // Aquí podrías guardar los datos en una base de datos o en un backend
    return tipos;
  }

  // Método para actualizar un tipo de PVP existente
  actualizarTipoPVP(tipoActualizado: any) {
    const tipos = this.getTiposPVP();
    const index = tipos.findIndex((t) => t.tipoPrecio === tipoActualizado.tipoPrecio);
    if (index !== -1) {
      tipos[index] = tipoActualizado;
    }
    // Aquí podrías guardar los datos en una base de datos o en un backend
    return tipos;
  }

  // Método para eliminar un tipo de PVP
  eliminarTipoPVP(tipoPrecio: string) {
    const tipos = this.getTiposPVP();
    const nuevosTipos = tipos.filter((t) => t.tipoPrecio !== tipoPrecio);
    // Aquí podrías guardar los datos en una base de datos o en un backend
    return nuevosTipos;
  }
}