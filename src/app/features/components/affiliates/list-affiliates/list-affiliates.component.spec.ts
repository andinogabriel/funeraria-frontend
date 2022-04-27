import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAffiliatesComponent } from './list-affiliates.component';

describe('ListAffiliatesComponent', () => {
  let component: ListAffiliatesComponent;
  let fixture: ComponentFixture<ListAffiliatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAffiliatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAffiliatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
