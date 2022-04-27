import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReusableComponent } from './table-reusable.component';

describe('TableReusableComponent', () => {
  let component: TableReusableComponent;
  let fixture: ComponentFixture<TableReusableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableReusableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableReusableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
