/**
 * Configuración para un filtro dinámico individual.
 * Define las opciones disponibles para un tipo de filtro.
 */
export interface FiltroConfiguracion {
  nombre: string;
  key: string;
  opciones: Array<{ id: string | number; nombre: string }>;
}


export interface FilterState {
  searchTerm: string;
  filtroActivo: string;
  filtrosDinamicos: { [key: string]: string };
}

