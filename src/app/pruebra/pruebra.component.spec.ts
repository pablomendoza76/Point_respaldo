import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebraComponent } from './pruebra.component';

describe('PruebraComponent', () => {
  let component: PruebraComponent;
  let fixture: ComponentFixture<PruebraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
