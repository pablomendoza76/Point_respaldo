import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente de formulario reutilizable y dinámico.
 * Recibe bloques de campos que pueden variar según el contexto (productos, clientes, etc.).
 * Permite personalizar inputs, selects, botones y manejar eventos de acción y cierre.
 */
@Component({
  selector: 'app-formulario-dinamico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.scss']
})
export class FormularioDinamicoComponent implements OnChanges {
  /** Título principal del formulario */
  @Input() titulo: string = 'Formulario';

  /** Lista de campos planos (usado si no se pasan bloques) */
  @Input() campos: Array<any> = [];

  /** Bloques estructurados con título y campos, ideales para formularios complejos */
  @Input() bloques: Array<{ titulo: string; campos: any[] }> = [];

  /** Diccionario de opciones para los campos tipo select (clave por key de campo) */
  @Input() opcionesSelect: Record<string, string[]> = {};

  /** Datos actuales del formulario (bind con ngModel) */
  @Input() datos: Record<string, any> = {};

  /** Define si el formulario está en modo edición */
  @Input() modoEdicion: boolean = false;

  /** Configuración de botones de acción (ej: enviar, cancelar, etc.) */
  @Input() botonesAccion: Array<any> = [];

  /** Evento emitido al hacer submit del formulario */
  @Output() guardar = new EventEmitter<any>();

  /** Evento emitido cuando el usuario hace clic en cerrar */
  @Output() cerrar = new EventEmitter<void>();

  /** Evento emitido cuando se lanza una acción personalizada desde un botón */
  @Output() accion = new EventEmitter<string>();

  /** Evento emitido siempre al cerrar el formulario (cancelar o guardar) */
  @Output() closed = new EventEmitter<void>();

  /** Procesa cambios en los inputs */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.bloques?.length && this.campos?.length) {
      this.bloques = this.generarBloquesDesdeCampos(this.campos);
    }
  }

  /** Agrupa campos por grupo para generar bloques si solo se pasan campos planos */
  private generarBloquesDesdeCampos(campos: any[]): { titulo: string; campos: any[] }[] {
    const mapa = new Map<string, any[]>();

    for (const campo of campos) {
      const grupo = campo.grupo || 'otros';
      if (!mapa.has(grupo)) mapa.set(grupo, []);
      mapa.get(grupo)!.push(campo);
    }

    return Array.from(mapa.entries()).map(([grupo, campos]) => ({
      titulo: this.capitalizar(grupo),
      campos
    }));
  }

  /** Capitaliza el texto y reemplaza guiones bajos por espacios */
  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).replace(/_/g, ' ');
  }

  /** Envía el formulario */
  onSubmit(): void {
    this.guardar.emit(this.datos);
    this.closed.emit();
  }

  /** Cierre manual del formulario (botón cerrar o acción externa) */
  onCerrar(): void {
    this.cerrar.emit();
    this.closed.emit();
  }

  /** Ejecuta una acción personalizada desde un botón */
  onAccion(accion: string): void {
    this.accion.emit(accion);
    if (accion === 'cancelar') {
      this.closed.emit();
    }
  }

  /** Obtiene las opciones para un campo tipo select */
  getOpcionesSelect(key: string): string[] {
    return this.opcionesSelect[key] || [];
  }

  /** Agrupa los campos en pares para renderizarlos en dos columnas */
  get camposAgrupados(): any[][] {
    const resultado = [];
    for (let i = 0; i < this.campos.length; i += 2) {
      resultado.push(this.campos.slice(i, i + 2));
    }
    return resultado;
  }
}
