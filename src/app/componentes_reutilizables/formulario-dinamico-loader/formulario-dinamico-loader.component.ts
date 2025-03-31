import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioDinamicoComponent } from '../formulario-dinamico/formulario-dinamico.component';

@Component({
  selector: 'app-formulario-dinamico-loader',
  standalone: true,
  imports: [CommonModule, FormularioDinamicoComponent],
  template: '<ng-template #contenedor></ng-template>',
  styleUrls: ['./formulario-dinamico-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormularioDinamicoLoaderComponent implements OnChanges {
  /**
   * Referencia al contenedor donde se inyectará dinámicamente el formulario.
   */
  @ViewChild('contenedor', { read: ViewContainerRef, static: true }) contenedor!: ViewContainerRef;

  /**
   * Controla si el formulario debe mostrarse o no.
   */
  @Input() isOpen: boolean = false;

  /**
   * Título que se mostrará en el encabezado del formulario.
   */
  @Input() titulo: string = '';

  /**
   * Lista de campos que se renderizan dinámicamente en el formulario.
   */
  @Input() campos: any[] = [];

  /**
   * Objeto de datos a editar o crear.
   */
  @Input() datos: any = {};

  /**
   * Indica si el formulario está en modo edición.
   */
  @Input() modoEdicion: boolean = false;

  /**
   * Botones personalizados a mostrar en el formulario (Guardar, Cancelar, etc.).
   */
  @Input() botonesAccion: any[] = [];

  /**
   * Emitido cuando se envía el formulario con éxito.
   */
  @Output() guardar = new EventEmitter<any>();

  /**
   * Emitido cuando el formulario es cerrado manualmente.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Emitido cuando se hace clic en un botón con acción personalizada.
   */
  @Output() accion = new EventEmitter<string>();

  /**
   * Emitido cuando se cierra el formulario por cualquier medio.
   */
  @Output() closed = new EventEmitter<void>();

  /**
   * Detecta cambios en los @Input y decide si debe renderizar el formulario.
   * @param changes Cambios detectados por Angular
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.renderizarFormulario();
    }
  }

  /**
   * Renderiza el componente `FormularioDinamicoComponent` dentro del contenedor dinámico.
   */
  private renderizarFormulario(): void {
    if (!this.contenedor) return;

    this.contenedor.clear();

    if (this.isOpen) {
      const view = this.contenedor.createComponent(FormularioDinamicoComponent);

      view.setInput('titulo', this.titulo);
      view.setInput('campos', this.campos);
      view.setInput('datos', this.datos);
      view.setInput('modoEdicion', this.modoEdicion);
      view.setInput('botonesAccion', this.botonesAccion);
      view.setInput('isOpen', this.isOpen);

      view.instance.guardar.subscribe((event) => this.guardar.emit(event));
      view.instance.cerrar.subscribe(() => this.cerrar.emit());
      view.instance.accion.subscribe((event) => this.accion.emit(event));
      view.instance.closed.subscribe(() => this.closed.emit());
    }
  }
}
