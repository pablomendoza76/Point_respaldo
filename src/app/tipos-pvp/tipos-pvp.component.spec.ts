import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposPVPComponent } from './tipos-pvp.component';

describe('TiposPvpComponent', () => {
  let component: TiposPVPComponent;
  let fixture: ComponentFixture<TiposPVPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposPVPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposPVPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
