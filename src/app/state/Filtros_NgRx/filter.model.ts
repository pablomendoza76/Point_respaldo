/**
 * Configuración para un filtro dinámico individual.
 * Define las opciones disponibles para un tipo de filtro.
 */
export interface FiltroConfiguracion {
  /**
   * Etiqueta visible en la UI (ej: "Categoría")
   */
  nombre: string;

  /**
   * Clave real usada para filtrar en el objeto producto (ej: "categoria")
   */
  key: string;

  /**
   * Opciones disponibles para seleccionar.
   */
  opciones: string[];

  /**
   * Valor actualmente seleccionado (opcional).
   */
  seleccionado?: string;
}

export interface FilterState {
  searchTerm: string;
  filtroActivo: string;
  filtrosDinamicos: { [key: string]: string };
}

