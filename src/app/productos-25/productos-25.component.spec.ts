import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productos25Component } from './productos-25.component';

describe('Productos25Component', () => {
  let component: Productos25Component;
  let fixture: ComponentFixture<Productos25Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productos25Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productos25Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
