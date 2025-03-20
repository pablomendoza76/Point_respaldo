import { Component, ElementRef, Renderer2 } from '@angular/core';
import { BarraUbicacionComponent } from '../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component'; 
import { BarraBusquedaComponent } from '../componentes_reutilizables/barra-busqueda/barra-busqueda.component';

@Component({
  selector: 'app-pruebra',
  standalone: true,
  imports: [ BarraUbicacionComponent, BarraBusquedaComponent],
  templateUrl: './pruebra.component.html',
  styleUrl: './pruebra.component.scss'
})
export class PruebraComponent {

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  opcionesBusqueda = [
    { value: 'codigo', label: 'Código' },
    { value: 'nombre', label: 'Nombre' },
  ];
  grupos = ['Grupo 1', 'Grupo 2'];
  marcas = ['Marca A', 'Marca B'];
  columnasDisponibles = [
    { name: 'Columna 1', selected: true },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 1', selected: true },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 1', selected: true },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    { name: 'Columna 2', selected: false },
    
  ];
  textoBotonAgregar = 'Agregar Producto';

  // Métodos para manejar eventos de BarraBusquedaComponent
  onBuscar(event: { tipo: string; valor: string }): void {
    console.log('Buscar:', event);
  }

  onFiltrar(event: { grupo: string; marca: string; filtro: string }): void {
    console.log('Filtrar:', event);
  }

  onExportar(): void {
    console.log('Exportar');
  }

  onImportar(): void {
    console.log('Importar');
  }

  onAgregar(): void {
    console.log('Agregar');
  }
  //  Mostrar/Ocultar el menú desplegable de Topbar
  toggleDropdown(event: Event): void {
    event.stopPropagation();

    const button = event.currentTarget as HTMLElement;
    const isActive = button.classList.contains('active');

    // Cierra todos los menús antes de abrir el nuevo
    this.closeAllDropdowns();

    if (!isActive) {
      this.renderer.addClass(button, 'active');
    }
  }

  //  Mostrar/Ocultar el menú de filtros
  toggleFilter(event: Event): void {
    event.stopPropagation();

    const button = event.currentTarget as HTMLElement;
    const filterContent = button.nextElementSibling as HTMLElement;

    if (filterContent) {
      filterContent.classList.toggle('hidden');
    }
  }

  //  Cierra todos los menús al hacer clic fuera
  closeAllDropdowns(): void {
    this.el.nativeElement.querySelectorAll('.topbar-btn').forEach((btn: HTMLElement) => {
      this.renderer.removeClass(btn, 'active');
    });

    this.el.nativeElement.querySelectorAll('.filter-content').forEach((menu: HTMLElement) => {
      this.renderer.addClass(menu, 'hidden');
    });
  }

  ngOnInit(): void {
    //  Cierra los menús al hacer clic fuera del componente
    this.renderer.listen('window', 'click', () => {
      this.closeAllDropdowns();
    });
  }
}

