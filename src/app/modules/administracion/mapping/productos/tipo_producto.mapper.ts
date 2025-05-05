import { Observable, map } from 'rxjs';
import { TipoProductoService } from '@modules/administracion/services/productos_services/tipo-producto.service';
import { TipoProducto } from '@modules/administracion/Interfaces/Productos/tipoProducto.model';

/**
 * Adaptador centralizado para tipos de producto.
 * Gestiona la transformación entre los datos de backend y los esperados por la vista.
 */
export const adaptarTipoProducto = {
  /**
   * Transforma los datos crudos obtenidos del backend al formato esperado por la vista.
   * @param tiposRaw Datos crudos del backend
   * @param columnasPrevias Columnas visibles previamente seleccionadas
   * @returns Objetos formateados y columnas generadas
   */
  desdeApi(
    tiposRaw: any[],
    columnasPrevias: { key: string; selected: boolean }[] = []
  ): {
    tipos: TipoProducto[];
    columnas: { key: string; name: string; selected: boolean }[];
  } {
    const tipos: TipoProducto[] = tiposRaw.map((t) => ({
      id: t.id,
      nombre: t.nombre,
      descripcion: t.descripcion,
      cod_sustento: t.cod_sustento,
      estaActivo: Number(t.estaActivo),
      fecha: t.fecha,
      ver: Number(t.ver),
    }));

    const columnas = Object.keys(tipos[0] || {}).map((key) => ({
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      selected: columnasPrevias.find((c) => c.key === key)?.selected ?? true,
    }));

    return { tipos, columnas };
  },

  /**
   * Prepara los datos antes de enviarlos al API.
   * @param tipo Objeto desde formulario
   * @returns Objeto limpio para el backend
   */
  paraEnvio(tipo: Partial<TipoProducto>): TipoProducto {
    return {
      id: tipo.id ?? 0,
      nombre: tipo.nombre?.trim() || '',
      descripcion: tipo.descripcion?.trim() || '',
      cod_sustento: tipo.cod_sustento?.trim() || '',
      estaActivo: Number(tipo.estaActivo ?? 1),
      fecha: tipo.fecha || new Date().toISOString().split('T')[0],
      ver: Number(tipo.ver ?? 1),
    };
  },

  /**
   * Obtiene todos los tipos de productos adaptados.
   * @param servicio Servicio de tipos de producto
   * @param columnasPrevias Columnas visibles previas
   * @returns Observable con tipos, columnas y total
   */
  obtenerTiposAdaptados(
    servicio: TipoProductoService,
    columnasPrevias: { key: string; selected: boolean }[] = []
  ): Observable<{
    tipos: TipoProducto[];
    columnas: { key: string; name: string; selected: boolean }[];
    total: number;
  }> {
    return servicio.getTiposProductos().pipe(
      map((tiposRaw) => {
        const { tipos, columnas } = this.desdeApi(tiposRaw, columnasPrevias);
        return {
          tipos,
          columnas,
          total: tipos.length,
        };
      })
    );
  },

  /**
   * Envia un nuevo tipo al backend usando el servicio.
   * @param servicio Servicio correspondiente
   * @param datos Datos del formulario
   * @returns Observable con la respuesta
   */
  crearTipoProducto(servicio: TipoProductoService, datos: Partial<TipoProducto>): Observable<any> {
    const tipoFormateado = this.paraEnvio(datos);
    return servicio.crearTipoProducto(tipoFormateado);
  },

  /**
   * Futuro: editarTipoProducto podría implementarse aquí si el backend lo permite.
   */
};
