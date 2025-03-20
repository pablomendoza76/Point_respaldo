import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarraUbicacionComponent } from '../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component'; // Importa el componente
import { PruebraComponent } from './pruebra.component';
import { RouterTestingModule } from '@angular/router/testing'; // Necesario si usas Router
import { CommonModule } from '@angular/common'; // Necesario si usas directivas como *ngIf o *ngFor

describe('PruebraComponent', () => {
  let component: PruebraComponent;
  let fixture: ComponentFixture<PruebraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PruebraComponent, BarraUbicacionComponent], // Declara ambos componentes
      imports: [CommonModule, RouterTestingModule], // Importa módulos necesarios
    }).compileComponents();

    fixture = TestBed.createComponent(PruebraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});