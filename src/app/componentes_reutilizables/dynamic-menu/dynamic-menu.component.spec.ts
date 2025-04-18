import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMenuComponent } from './dynamic-menu.component';

describe('DynamicMenuComponent', () => {
  let component: DynamicMenuComponent;
  let fixture: ComponentFixture<DynamicMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
