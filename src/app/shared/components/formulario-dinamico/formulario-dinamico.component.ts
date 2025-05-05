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
import { NgSelectModule } from '@ng-select/ng-select';

/**
 * Componente de formulario reutilizable y dinámico.
 * Divide los bloques en dos columnas y permite personalización de campos y botones.
 */
@Component({
  selector: 'app-formulario-dinamico',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.scss']
})
export class FormularioDinamicoComponent implements OnChanges {
  /** Título del formulario */
  @Input() titulo: string = 'Formulario';

  /** Bloques estructurados que agrupan los campos del formulario */
  @Input() bloques: Array<{ titulo: string; campos: any[] }> = [];

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

  /** Bloques asignados a la columna izquierda */
  bloquesIzquierda: Array<{ titulo: string; campos: any[] }> = [];

  /** Bloques asignados a la columna derecha */
  bloquesDerecha: Array<{ titulo: string; campos: any[] }> = [];

  /**
   * Detecta cambios en los bloques y los distribuye en columnas izquierda/derecha
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bloques'] && Array.isArray(this.bloques)) {
      this.repartirBloquesEnColumnas(this.bloques);
    }
  }

  /**
   * Divide los bloques entre izquierda y derecha de forma alterna
   * @param bloques Lista de bloques originales
   */
  private repartirBloquesEnColumnas(bloques: Array<{ titulo: string; campos: any[] }>): void {
    this.bloquesIzquierda = [];
    this.bloquesDerecha = [];
  
    const bloquesValidos = bloques.filter(b => Array.isArray(b.campos) && b.campos.length > 0);
  
    bloquesValidos.forEach((bloque, index) => {
      if (index % 2 === 0) {
        this.bloquesIzquierda.push(bloque);
      } else {
        this.bloquesDerecha.push(bloque);
      }
    });
  }
  

  /**
   * Emite los datos del formulario al hacer submit, diferenciando edición y creación
   */
  onSubmit(): void {
    console.log('[DEBUG] Datos en this.datos al guardar:', this.datos);
    if (this.modoEdicion && typeof this.datos['codigo'] === 'number') {
      this.guardar.emit({ codigo: this.datos['codigo'], datos: { ...this.datos } });
    } else {
      this.guardar.emit({ ...this.datos });
    }
    this.closed.emit();
  }

  /**
   * Cierra el formulario sin guardar
   */
  onCerrar(): void {
    this.cerrar.emit();
    this.closed.emit();
  }

  /**
   * Ejecuta una acción personalizada y cierra si la acción es cancelar
   * @param accion Nombre de la acción
   */
  onAccion(accion: string): void {
    this.accion.emit(accion);
    if (accion === 'cancelar') {
      this.closed.emit();
    }
  }

  /**
   * Ejecuta la función `onChange` si está definida en el campo
   * @param campo Campo con lógica personalizada
   * @param valor Valor seleccionado
   */
  onCampoChange(changes: SimpleChanges): void {
    if (changes['bloques'] && changes['bloques'].currentValue !== changes['bloques'].previousValue) {
      // Angular detecta cambio de referencia
      this.repartirBloquesEnColumnas(this.bloques);
    } else if (changes['bloques']) {
      // Fuerza redistribución aunque la referencia no haya cambiado
      setTimeout(() => {
        this.repartirBloquesEnColumnas(this.bloques);
      });
    }
  }
  
    

  /**
   * Verifica si un bloque contiene radios tipo Sí/No (dos opciones)
   * @param bloque Bloque de campos
   * @returns True si hay radios con dos opciones
   */
  tieneRadiosSiNo(bloque: { campos: any[] }): boolean {
    return bloque.campos?.some(campo => campo.tipo === 'radio' && campo.opciones?.length === 2);
  }

  /** Devuelve true si solo hay un bloque con campos válidos */
get hayUnSoloBloqueConCampos(): boolean {
  const bloquesValidos = this.bloques.filter(b => Array.isArray(b.campos) && b.campos.length > 0);
  return bloquesValidos.length === 1;
}

trackByCampo(index: number, campo: any): string {
  return campo?.key || index;
}



}
