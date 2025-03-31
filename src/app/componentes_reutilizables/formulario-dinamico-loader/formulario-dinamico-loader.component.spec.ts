import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioDinamicoLoaderComponent } from './formulario-dinamico-loader.component';

describe('FormularioDinamicoLoaderComponent', () => {
  let component: FormularioDinamicoLoaderComponent;
  let fixture: ComponentFixture<FormularioDinamicoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioDinamicoLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioDinamicoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
