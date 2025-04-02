export interface ColumnaVisible {
  name: string;
  key: string;
  selected: boolean;
}

export interface TablaState {
  productos: any[];
  productosOriginales: any[];
  productosVisibles: any[];
  columnasVisibles: { name: string; key: string }[];
  paginaActual: number;
  itemsPorPagina: number;
  totalRegistros: number;
  searchTerm: string;
  filtrosDinamicos: { [key: string]: any };
}


