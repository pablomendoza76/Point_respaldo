export interface ColumnaVisible {
  name: string;
  key: string;
  selected: boolean;
}

export interface TablaState {
  productos: any[];
  productosVisibles: any[];
  columnasVisibles: ColumnaVisible[];
  paginaActual: number;
  itemsPorPagina: number;
  totalRegistros: number;
  searchTerm: string;
  filtrosDinamicos: { [key: string]: string };
}
