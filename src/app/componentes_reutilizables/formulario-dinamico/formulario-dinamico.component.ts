import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente de formulario reutilizable y dinámico.
 * Recibe bloques de campos que pueden variar según el contexto.
 * Permite personalizar inputs, selects, botones y manejar eventos.
 */
@Component({
  selector: 'app-formulario-dinamico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.scss']
})
export class FormularioDinamicoComponent implements OnChanges {
  /** Título del formulario */
  @Input() titulo: string = 'Formulario';

  /** Bloques estructurados que agrupan los campos del formulario */
  @Input() bloques: Array<{ titulo: string; campos: any[] }> = [];

  /** Opciones disponibles para campos tipo select */
  @Input() opcionesSelect: Record<string, string[]> = {};

  /** Datos precargados del formulario */
  @Input() datos: Record<string, any> = {};

  /** Determina si el formulario está en modo edición */
  @Input() modoEdicion: boolean = false;

  /** Lista de botones que se mostrarán al pie del formulario */
  @Input() botonesAccion: Array<any> = [];

  /** Evento emitido al guardar los datos del formulario */
  @Output() guardar = new EventEmitter<any>();

  /** Evento emitido al hacer clic en cerrar */
  @Output() cerrar = new EventEmitter<void>();

  /** Evento emitido al ejecutar una acción personalizada */
  @Output() accion = new EventEmitter<string>();

  /** Evento emitido cuando se cierra completamente el formulario */
  @Output() closed = new EventEmitter<void>();

  /**
   * Getter para verificar si hay bloques disponibles
   */
  get hayBloques(): boolean {
    return Array.isArray(this.bloques) && this.bloques.length > 0;
  }

  /**
   * Getter para verificar si hay botones de acción definidos
   */
  get hayBotones(): boolean {
    return Array.isArray(this.botonesAccion) && this.botonesAccion.length > 0;
  }

  /**
   * Detecta cambios en los inputs y genera bloques automáticamente
   * si no se han definido manualmente.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ((!this.bloques || this.bloques.length === 0) && this.datos) {
      this.bloques = this.generarBloquesDesdeDatos(this.datos);
    }
  }

  private generarBloquesDesdeDatos(datos: any): Array<{ titulo: string; campos: any[] }> {
    const campos = Object.keys(datos).map(key => ({
      key,
      label: this.capitalizar(key),
      tipo: this.inferirTipoCampo(datos[key]),
      required: false
    }));

    return [{
      titulo: 'Todos los Campos',
      campos
    }];
  }

  private capitalizar(texto: string): string {
    return texto
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private inferirTipoCampo(valor: any): string {
    if (typeof valor === 'number') return 'number';
    if (typeof valor === 'boolean') return 'radio';
    if (this.esFecha(valor)) return 'date';
    return 'text';
  }

  private esFecha(valor: any): boolean {
    if (!valor || typeof valor !== 'string') return false;
    return !isNaN(Date.parse(valor));
  }

  onSubmit(): void {
    this.guardar.emit(this.datos);
    this.closed.emit();
  }

  onCerrar(): void {
    this.cerrar.emit();
    this.closed.emit();
  }

  onAccion(accion: string): void {
    this.accion.emit(accion);
    if (accion === 'cancelar') {
      this.closed.emit();
    }
  }
}
 