import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifasPorGrupoComponent } from './tarifas-por-grupo.component';

describe('TarifasPorGrupoComponent', () => {
  let component: TarifasPorGrupoComponent;
  let fixture: ComponentFixture<TarifasPorGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifasPorGrupoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarifasPorGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
