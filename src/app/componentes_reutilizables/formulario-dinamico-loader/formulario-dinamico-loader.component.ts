import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  HostBinding
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioDinamicoComponent } from '../formulario-dinamico/formulario-dinamico.component';

/**
 * Componente contenedor dinámico que carga y muestra el FormularioDinamicoComponent
 * en tiempo de ejecución usando ViewContainerRef.
 */
@Component({
  selector: 'app-formulario-dinamico-loader',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-template #contenedor></ng-template>',
  styleUrls: ['./formulario-dinamico-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormularioDinamicoLoaderComponent implements OnChanges {
  /** Contenedor donde se insertará el formulario dinámico */
  @ViewChild('contenedor', { read: ViewContainerRef, static: true })
  contenedor!: ViewContainerRef;

  /** Controla la visibilidad del formulario */
  @Input() mostrar: boolean = false;

  /** Título del formulario a renderizar */
  @Input() titulo: string = '';

  /** Bloques de campos estructurados del formulario */
  @Input() bloques: Array<{ titulo: string; campos: any[] }> = [];

  /** Datos a precargar en el formulario */
  @Input() datos: any = {};

  /** Define si el formulario está en modo edición */
  @Input() modoEdicion: boolean = false;

  /** Botones personalizados a renderizar en el formulario */
  @Input() botonesAccion: any[] = [];

  /** Evento emitido al guardar el formulario */
  @Output() guardar = new EventEmitter<any>();

  /** Evento emitido al cerrar manualmente el formulario */
  @Output() cerrar = new EventEmitter<void>();

  /** Evento emitido por acciones personalizadas */
  @Output() accion = new EventEmitter<string>();

  /** Evento emitido al cerrar el formulario completamente */
  @Output() closed = new EventEmitter<void>();

  /**
   * Asigna la clase CSS `.visible` al componente cuando mostrar es true
   */
  @HostBinding('class.visible') get isVisible(): boolean {
    return this.mostrar;
  }

  /**
   * Escucha cambios en las propiedades de entrada para crear o actualizar el formulario dinámico
   * @param changes Cambios detectados en las propiedades de entrada
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.renderizarFormulario();
  }

  /**
   * Renderiza el componente FormularioDinamicoComponent dentro del contenedor si mostrar es true.
   * En caso contrario, limpia el contenedor.
   */
  private renderizarFormulario(): void {
    this.contenedor.clear();

    if (this.mostrar) {
      try {
        const view = this.contenedor.createComponent(FormularioDinamicoComponent);

        view.setInput('titulo', this.titulo);
        view.setInput('bloques', this.bloques);
        view.setInput('datos', { ...this.datos });
        view.setInput('modoEdicion', this.modoEdicion);
        view.setInput('botonesAccion', this.botonesAccion);

        view.instance.guardar.subscribe((event) => this.guardar.emit(event));
        view.instance.cerrar.subscribe(() => this.cerrar.emit());
        view.instance.accion.subscribe((event) => this.accion.emit(event));
        view.instance.closed.subscribe(() => this.closed.emit());
      } catch (error) {
        console.error('Error al crear el formulario dinámico:', error);
      }
    }
  }
}
