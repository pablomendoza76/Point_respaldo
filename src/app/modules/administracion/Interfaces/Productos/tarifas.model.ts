/**
 * Interfaz que representa un grupo de tarifas al ser enviado al backend.
 * Define todos los campos requeridos para crear o actualizar un grupo.
 */
export interface GrupoTarifa {
    /** Código único del grupo (0 si es nuevo) */
    codigo: number
  
    /** Nombre del grupo de productos */
    nombre: string
  
    /** Descripción del grupo */
    descripcion: string
  
    /** Indicador de visibilidad en la web: 1 (sí), 0 (no) */
    vista_web: number
  
    /** Indicador de visibilidad en el sistema: true (sí), false (no) */
    vista_sistema: boolean
  
    /** Número de meses de garantía del grupo */
    meses_garantia: number
  
    /** Estado del grupo: 1 (activo), 0 (inactivo) */
    activo: number
  
    /** Indicador si es grupo padre: 1 (sí), 0 (no) */
    parent: number
  
    /** Factor de conversión del grupo de productos */
    prodgp_factor_conv: number
  
    /** Orden de aparición del grupo */
    orden: number
  
    /** URL o nombre de imagen asociada al grupo */
    img: string
  }
  