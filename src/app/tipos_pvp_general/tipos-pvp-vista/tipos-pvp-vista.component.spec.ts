import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposPvpVistaComponent } from './tipos-pvp-vista.component';

describe('TiposPvpVistaComponent', () => {
  let component: TiposPvpVistaComponent;
  let fixture: ComponentFixture<TiposPvpVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposPvpVistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposPvpVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
