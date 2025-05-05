import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente modal de confirmación de eliminación.
 * Se puede reutilizar para eliminar productos, marcas u otros registros genéricos.
 */
@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  /**
   * Controla la visibilidad del modal.
   */
  @Input() isOpen = false;

  /**
   * Objeto del ítem a eliminar (puede ser producto, marca, etc.).
   */
  @Input() itemName: any = '';

  /**
   * Mensaje de advertencia que se muestra en el modal.
   */
  @Input() warningMessage = 'Esta acción no se puede deshacer.';

  /**
   * Texto del botón de confirmación.
   */
  @Input() confirmButtonText = 'Eliminar';

  /**
   * Texto del botón de cancelación.
   */
  @Input() cancelButtonText = 'Cancelar';

  /**
   * Título del modal.
   */
  @Input() title = 'Confirmar eliminación';

  /**
   * Evento emitido al confirmar la eliminación.
   * Devuelve el objeto a eliminar.
   */
  @Output() confirmed = new EventEmitter<any>();

  /**
   * Evento emitido al cancelar la operación.
   */
  @Output() canceled = new EventEmitter<void>();

  /**
   * Evento emitido al cerrar el modal, sin importar si se confirmó o canceló.
   */
  @Output() closed = new EventEmitter<void>();

  /**
   * Lógica al confirmar la eliminación: emite el item y cierra el modal.
   */
  onConfirm(): void {
    this.confirmed.emit(this.itemName);
    this.closed.emit();
  }

  /**
   * Lógica al cancelar la eliminación: emite cancelación y cierra el modal.
   */
  onCancel(): void {
    this.canceled.emit();
    this.closed.emit();
  }
}
