import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // <- Importar CommonModule

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule], // <- Incluirlo aquí
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  @Input() isOpen = false;
  @Input() itemName = '';
  @Input() warningMessage = 'Esta acción no se puede deshacer.';
  @Input() confirmButtonText = 'Eliminar';
  @Input() cancelButtonText = 'Cancelar';
  @Input() title = 'Confirmar eliminación';

  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.closed.emit();
  }

  onCancel(): void {
    this.canceled.emit();
    this.closed.emit();
  }
}
