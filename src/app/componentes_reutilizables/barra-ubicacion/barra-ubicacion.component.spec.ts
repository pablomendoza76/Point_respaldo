import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraUbicacionComponent } from './barra-ubicacion.component';

describe('BarraUbicacionComponent', () => {
  let component: BarraUbicacionComponent;
  let fixture: ComponentFixture<BarraUbicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraUbicacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
