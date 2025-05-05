import { Observable, map } from 'rxjs';
import { MarcasService } from '@modules/administracion/services/productos_services/marcas.service';
import { Marca } from '../../Interfaces/Productos/marcas.model'; 

/**
 * Adaptador centralizado para manejar la transformación y comunicación de datos
 * relacionados con las marcas. Se encarga de adaptar los datos entre el servicio
 * y la vista del componente.
 */
export const adaptarMarca = {
  /**
   * Transforma los datos crudos obtenidos del backend al formato esperado por la vista.
   * @param marcasRaw Arreglo crudo desde la API
   * @param columnasPrevias Columnas seleccionadas previamente
   * @returns Arreglo adaptado de marcas y columnas para la tabla
   */
  desdeApi(
    marcasRaw: any[],
    columnasPrevias: { key: string; selected: boolean }[] = []
  ): {
    marcas: Marca[];
    columnas: { key: string; name: string; selected: boolean }[];
  } {
    const marcas: Marca[] = marcasRaw.map((m: any) => ({
      id: m.id,
      nombre: m.nombre,
      descripcion: m.descripcion,
    }));

    const columnas = Object.keys(marcas[0] || {}).map((key) => ({
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      selected: columnasPrevias.find((c) => c.key === key)?.selected ?? true,
    }));

    return { marcas, columnas };
  },

  /**
   * Prepara un objeto `Marca` antes de ser enviado a la API.
   * @param marca Objeto del formulario
   * @returns Objeto limpio con nombre y descripción
   */
  paraEnvio(marca: Partial<Marca>): Marca {
    return {
      nombre: marca.nombre?.trim() || '',
      descripcion: marca.descripcion?.trim() || '',
    };
  },

  /**
   * Obtiene todas las marcas desde el servicio, adaptadas al formato del componente.
   * @param servicio Servicio de marcas
   * @param columnasPrevias Columnas visibles previas
   * @returns Observable con marcas, columnas y total
   */
  obtenerMarcasAdaptadas(
    servicio: MarcasService,
    columnasPrevias: { key: string; selected: boolean }[] = []
  ): Observable<{
    marcas: Marca[];
    columnas: { key: string; name: string; selected: boolean }[];
    total: number;
  }> {
    return servicio.getMarcas().pipe(
      map((marcasRaw: any[]) => {
        const { marcas, columnas } = this.desdeApi(marcasRaw, columnasPrevias);
        return {
          marcas,
          columnas,
          total: marcas.length,
        };
      })
    );
  },

  /**
   * Envía una nueva marca al backend utilizando el servicio.
   * @param servicio Servicio de marcas
   * @param datos Datos del formulario
   * @returns Observable con la respuesta del backend
   */
  crearMarca(servicio: MarcasService, datos: Partial<Marca>): Observable<any> {
    const marcaFormateada = this.paraEnvio(datos);
    return servicio.crearMarca(marcaFormateada);
  },

  /**
   * Actualiza una marca existente mediante el servicio.
   * @param servicio Servicio de marcas
   * @param id ID de la marca a actualizar
   * @param datos Datos actualizados del formulario
   * @returns Observable con la respuesta del backend
   */
  editarMarca(servicio: MarcasService, id: number, datos: Partial<Marca>): Observable<any> {
    const marcaFormateada = this.paraEnvio(datos);
    return servicio.editarMarca(id, marcaFormateada);
  },
};
