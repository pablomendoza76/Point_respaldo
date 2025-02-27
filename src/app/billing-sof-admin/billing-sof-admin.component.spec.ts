import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSofAdminComponent } from './billing-sof-admin.component';

describe('BillingSofAdminComponent', () => {
  let component: BillingSofAdminComponent;
  let fixture: ComponentFixture<BillingSofAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingSofAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingSofAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
