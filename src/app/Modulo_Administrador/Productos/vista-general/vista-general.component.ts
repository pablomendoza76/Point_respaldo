import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppState } from '../../../state/tabla_NgRx/tabla.state';
import {
  setProductos,
  setColumnasVisibles,
  setFiltrosDinamicos
} from '../../../state/tabla_NgRx/tabla.actions';
import {
  selectProductosVisibles,
  selectTotalRegistros
} from '../../../state/tabla_NgRx/tabla.selectors';

import { BarraUbicacionComponent } from '../../../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component';
import { BarraBusquedaComponent } from '../../../componentes_reutilizables/barra-busqueda/barra-busqueda.component';
import { TablaDinamicaComponent } from '../../../componentes_reutilizables/tabla-dinamica/tabla-dinamica.component';
import { AdministracionServicios } from '../../../services/productos_services/administracion.service';

@Component({
  selector: 'app-vista-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VistaGeneralComponent implements OnInit {
  productosVisibles$: Observable<any[]>;
  columnasDisponibles: any[] = [];
  columnasSeleccionadas: any[] = [];
  filtrosConfiguracion: any[] = [];

  // 🔍 Opciones de búsqueda ajustadas a las claves reales del backend
  opcionesBusqueda = [
    { value: 'codigo', label: 'Cod. Común' },
    { value: 'nombreUnico', label: 'Nombre' },
    { value: 'codbarras1', label: 'Cod. de Barras 1' },
    { value: 'codbarras2', label: 'Cod. de Barras 2' },
    { value: 'codbarras3', label: 'Cod. de Barras 3' }
  ];

  constructor(
    private store: Store<AppState>,
    private adminService: AdministracionServicios
  ) {
    this.productosVisibles$ = this.store.pipe(
      select(selectProductosVisibles),
      tap(data => console.log('📦 Productos visibles:', data))
    );
  }

  ngOnInit(): void {
    this.adminService.obtenerProductosYColumnas().subscribe(({ productos, columnas, marcas, grupos }) => {
      this.store.dispatch(setProductos({ productos }));

      this.columnasDisponibles = columnas;
      this.columnasSeleccionadas = columnas.filter(col => col.selected);
      this.store.dispatch(setColumnasVisibles({ columnasVisibles: this.columnasSeleccionadas }));

      this.filtrosConfiguracion = [
        { nombre: 'Grupo', key: 'productogrupoCodigo', opciones: grupos },
        { nombre: 'Marca', key: 'marcaId', opciones: marcas }
      ];
    });
  }

  extraerValoresUnicos(productos: any[], key: string): string[] {
    return Array.from(
      new Set(productos.map(p => p[key]).filter(v => v !== undefined && v !== null))
    ).map(String);
  }

  onFiltrosAplicados(filtros: { [key: string]: string }): void {
    console.log('🎯 Filtros aplicados:', filtros);
    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: filtros }));
  }

  onColumnasActualizadas(columnas: { name: string; key: string; selected: boolean }[]): void {
    this.columnasDisponibles.forEach(col => {
      const actualizada = columnas.find(c => c.key === col.key);
      if (actualizada) {
        col.selected = actualizada.selected;
      }
    });

    this.columnasSeleccionadas = this.columnasDisponibles.filter(col => col.selected);
    this.store.dispatch(setColumnasVisibles({ columnasVisibles: this.columnasSeleccionadas }));
  }

  onEditarProducto(producto: any): void {
    console.log('✏️ Editar producto:', producto);
  }

  onEliminarProducto(producto: any): void {
    console.log('🗑️ Eliminar producto:', producto);
  }
}
