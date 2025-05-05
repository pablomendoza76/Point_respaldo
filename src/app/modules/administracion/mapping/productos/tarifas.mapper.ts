import { GrupoTarifa } from '@modules/administracion/Interfaces/Productos/tarifas.model'
import { TarifasService } from '@modules/administracion/services/productos_services/tarifas.service'
import { Observable, map } from 'rxjs'

/**
 * Adaptador para transformar datos de grupos con tarifas entre la API, el servicio y el formulario.
 */
export const adaptarTarifas = {
  /**
   * Devuelve un objeto base vacío con estructura para nuevo grupo.
   * Útil para inicializar formularios de creación.
   */
  obtenerGrupoVacio(): GrupoTarifa {
    return {
      codigo: 0,
      nombre: '',
      descripcion: '',
      vista_web: 0,
      vista_sistema: false,
      meses_garantia: 0,
      activo: 1,
      parent: 0,
      prodgp_factor_conv: 0,
      orden: 0,
      img: '',
    }
  },

  /**
   * Formatea y limpia los datos del formulario antes de enviarlos a la API.
   * Convierte campos booleanos y numéricos al formato requerido por el backend.
   * 
   * @param grupo Grupo crudo desde el formulario
   * @returns Objeto tipo GrupoTarifa formateado
   */
  prepararParaEnvio(grupo: any): GrupoTarifa {
    return {
      codigo: Number(grupo.codigo ?? 0),
      nombre: grupo.nombre?.trim() || '',
      descripcion: grupo.descripcion?.trim() || '',
      vista_web: Number(grupo.vista_web) || 0,
      vista_sistema: grupo.vista_sistema === true || grupo.vista_sistema === 'true',
      meses_garantia: Number(grupo.meses_garantia) || 0,
      activo: Number(grupo.activo) || 0,
      parent: Number(grupo.parent) || 0,
      prodgp_factor_conv: Number(grupo.prodgp_factor_conv) || 0,
      orden: Number(grupo.orden) || 0,
      img: grupo.img || '',
    }
  },

  /**
   * Adapta la respuesta cruda de la API al formato requerido por la vista.
   * Convierte booleanos y valores numéricos al formato usado por el formulario.
   * 
   * @param servicio Servicio de tarifas
   * @returns Observable con arreglo de grupos adaptados
   */
  obtenerGruposAdaptados(servicio: TarifasService): Observable<GrupoTarifa[]> {
    return servicio.getGruposConTarifas().pipe(
      map((gruposRaw: any[]) =>
        gruposRaw.map((grupo) => ({
          codigo: grupo.codigo,
          nombre: grupo.nombre,
          descripcion: grupo.descripcion,
          vista_web: grupo.vista_web ?? 0,
          vista_sistema: grupo.vista_sistema === true || grupo.vista_sistema === 1,
          meses_garantia: grupo.meses_garantia ?? 0,
          activo: grupo.activo ?? 1,
          parent: grupo.parent ?? 0,
          prodgp_factor_conv: grupo.prodgp_factor_conv ?? 0,
          orden: grupo.orden ?? 0,
          img: grupo.img || '',
        }))
      )
    )
  },

  /**
   * Llama al servicio para enviar un nuevo grupo formateado.
   * 
   * @param servicio Servicio de tarifas
   * @param grupo Datos crudos desde el formulario
   * @returns Observable con respuesta del backend
   */
  crearGrupo(servicio: TarifasService, grupo: any): Observable<any> {
    const data = this.prepararParaEnvio(grupo)
    return servicio.agregarGrupo(data)
  },

  /**
   * Llama al servicio para actualizar un grupo existente.
   * 
   * @param servicio Servicio de tarifas
   * @param grupo Datos crudos desde el formulario (con `codigo`)
   * @returns Observable con respuesta del backend
   */
  actualizarGrupo(servicio: TarifasService, grupo: any): Observable<any> {
    const data = this.prepararParaEnvio(grupo)
    return servicio.actualizarGrupo(data)
  },

  /**
   * Llama al servicio para eliminar un grupo por su código.
   * 
   * @param servicio Servicio de tarifas
   * @param codigo Código único del grupo a eliminar
   * @returns Observable con respuesta del backend
   */
  eliminarGrupo(servicio: TarifasService, codigo: number): Observable<any> {
    return servicio.eliminarGrupo(codigo)
  },
}
