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

  /**
   * Genera un bloque único con todos los campos del objeto recibido
   * @param datos Objeto con claves y valores para el formulario
   * @returns Arreglo con un solo bloque de campos
   */
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

  /**
   * Convierte claves en texto legible capitalizado
   * @param texto Texto a capitalizar
   * @returns Texto capitalizado
   */
  private capitalizar(texto: string): string {
    return texto
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Determina el tipo de campo según el valor recibido
   * @param valor Valor del campo
   * @returns Tipo de input: text, number, radio o date
   */
  private inferirTipoCampo(valor: any): string {
    if (typeof valor === 'number') return 'number';
    if (typeof valor === 'boolean') return 'radio';
    if (this.esFecha(valor)) return 'date';
    return 'text';
  }

  /**
   * Valida si un valor representa una fecha válida con guiones o slashes
   * @param valor Valor a evaluar
   * @returns True si el valor tiene formato y es parseable como fecha
   */
  private esFecha(valor: any): boolean {
    if (!valor || typeof valor !== 'string') return false;
    const contieneFormatoFecha = /[-/]/.test(valor);
    return contieneFormatoFecha && !isNaN(Date.parse(valor));
  }

  /**
   * Emite el evento de guardar al enviar el formulario.
   * En modo edición se emite el código por separado.
   * En modo creación se emite un único objeto con todos los datos.
   */
  onSubmit(): void {
    if (this.modoEdicion) {
      if (!this.datos || typeof this.datos['codigo'] !== 'number') return;

      this.guardar.emit({
        codigo: this.datos['codigo'],
        datos: { ...this.datos }
      });
    } else {
      const datosParaCrear = { ...this.datos };
    console.log('Enviando datos para creación:', datosParaCrear);
    this.guardar.emit(datosParaCrear);
    }

    this.closed.emit();
  }

  /**
   * Emite el evento de cerrar el formulario sin guardar
   */
  onCerrar(): void {
    this.cerrar.emit();
    this.closed.emit();
  }

  /**
   * Ejecuta una acción personalizada y cierra si es cancelar
   * @param accion Nombre de la acción a ejecutar
   */
  onAccion(accion: string): void {
    this.accion.emit(accion);
    if (accion === 'cancelar') {
      this.closed.emit();
    }
  }

  /**
   * Retorna el código y los datos modificados del formulario
   * solo si el formulario está en modo edición.
   * Se puede invocar manualmente desde el componente padre.
   * @returns Objeto con el código y los datos actualizados
   */
  emitirDatosActualizados(): { codigo: number; datos: any } | null {
    if (!this.modoEdicion || !this.datos || typeof this.datos['codigo'] !== 'number') {
      return null;
    }

    return {
      codigo: this.datos['codigo'],
      datos: { ...this.datos }
    };
  }

  /**
 * Ejecuta la función `onChange` si está definida en el campo.
 * Esto permite reacciones dinámicas como cargar subgrupos al cambiar el grupo.
 * 
 * @param campo Campo actual con posible onChange
 * @param valor Valor seleccionado por el usuario
 */
onCampoChange(campo: any, valor: any): void {
  if (campo.onChange && typeof campo.onChange === 'function') {
    campo.onChange(valor);
  }
}

/**
 * Verifica si el bloque contiene al menos un campo tipo radio con solo dos opciones
 * @param bloque Bloque de campos
 * @returns true si hay radios tipo Sí/No
 */
tieneRadiosSiNo(bloque: { campos: any[] }): boolean {
  return bloque.campos?.some(campo => campo.tipo === 'radio' && campo.opciones?.length === 2);
}



}
