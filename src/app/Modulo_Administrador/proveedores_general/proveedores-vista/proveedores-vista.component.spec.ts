import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresVistaComponent } from './proveedores-vista.component';

describe('ProveedoresVistaComponent', () => {
  let component: ProveedoresVistaComponent;
  let fixture: ComponentFixture<ProveedoresVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedoresVistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedoresVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
