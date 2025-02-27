import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCuentasComponent } from './plan-cuentas.component';

describe('PlanCuentasComponent', () => {
  let component: PlanCuentasComponent;
  let fixture: ComponentFixture<PlanCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanCuentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
