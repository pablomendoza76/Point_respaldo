/**
 * Configuración para un filtro dinámico individual.
 * Define las opciones disponibles para un tipo de filtro.
 */
export interface FiltroConfiguracion {
  nombre: string;
  opciones: string[];
  seleccionado?: string;
}

/**
 * Estado completo del módulo de filtros.
 * Contiene solo información de búsqueda y filtros dinámicos.
 */
export interface FilterState {
  searchTerm: string;
  filtroActivo: string;
  filtrosDinamicos: { [key: string]: string };
}
