import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente de formulario reutilizable y dinámico.
 * Permite definir campos personalizados, botones y manejo de acciones mediante `@Input()` y `@Output()`.
 */
@Component({
  selector: 'app-formulario-dinamico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.scss']
})
export class FormularioDinamicoComponent {
  /**
   * Título del formulario que aparece en el encabezado del modal.
   */
  @Input() titulo: string = 'Formulario';

  /**
   * Lista de campos a mostrar en el formulario.
   * Cada campo debe tener: `key`, `label`, `tipo`, `required`, `disabled`, etc.
   */
  @Input() campos: Array<any> = [];

  /**
   * Diccionario de opciones para los campos tipo select.
   * Ejemplo: `{ categoria: ['A', 'B'] }`
   */
  @Input() opcionesSelect: Record<string, string[]> = {};

  /**
   * Objeto que contiene los datos actuales del formulario.
   * Se actualiza en tiempo real con `ngModel`.
   */
  @Input() datos: Record<string, any> = {};

  /**
   * Define si el formulario se encuentra en modo edición.
   */
  @Input() modoEdicion: boolean = false;

  /**
   * Lista de botones de acción personalizados.
   * Cada botón puede tener: `texto`, `tipo`, `icono`, `accion`, `deshabilitado`.
   */
  @Input() botonesAccion: Array<any> = [];

  /**
   * Controla si el modal debe mostrarse o no.
   */
  @Input() isOpen: boolean = false;

  /**
   * Emitido cuando se envía el formulario correctamente (submit).
   */
  @Output() guardar = new EventEmitter<any>();

  /**
   * Emitido cuando el usuario cierra el formulario manualmente.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Emitido cuando se hace clic en un botón personalizado.
   */
  @Output() accion = new EventEmitter<string>();

  /**
   * Emitido cuando el formulario se cierra por cualquier causa.
   * (guardar, cancelar, cerrar)
   */
  @Output() closed = new EventEmitter<void>();

  /**
   * Emitir evento de guardar con los datos actuales del formulario.
   */
  onSubmit(): void {
    this.guardar.emit(this.datos);
    this.closed.emit();
  }

  /**
   * Emitir evento de cancelación/cierre sin guardar.
   */
  onCerrar(): void {
    this.cerrar.emit();
    this.closed.emit();
  }

  /**
   * Ejecuta la acción personalizada desde el botón correspondiente.
   * @param accion Nombre de la acción definida
   */
  onAccion(accion: string): void {
    this.accion.emit(accion);
    if (accion === 'cancelar') {
      this.closed.emit();
    }
  }

  /**
   * Devuelve la lista de opciones para campos tipo select.
   * @param key Clave del campo
   * @returns Opciones para ese campo
   */
  getOpcionesSelect(key: string): string[] {
    return this.opcionesSelect[key] || [];
  }

  /**
   * Agrupa los campos en pares para disposición en filas de 2.
   * @returns Lista de grupos de 2 campos
   */
  get camposAgrupados(): any[][] {
    const resultado = [];
    for (let i = 0; i < this.campos.length; i += 2) {
      resultado.push(this.campos.slice(i, i + 2));
    }
    return resultado;
  }
}
