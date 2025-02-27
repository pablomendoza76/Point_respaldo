import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposProductosComponent } from './tipos-productos.component';

describe('TiposProductosComponent', () => {
  let component: TiposProductosComponent;
  let fixture: ComponentFixture<TiposProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
