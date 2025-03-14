import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasVistasComponent } from './cuentas-vistas.component';

describe('CuentasVistasComponent', () => {
  let component: CuentasVistasComponent;
  let fixture: ComponentFixture<CuentasVistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentasVistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasVistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
