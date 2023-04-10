import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuneralMoreInfoComponent } from './funeral-more-info.component';

describe('FuneralMoreInfoComponent', () => {
  let component: FuneralMoreInfoComponent;
  let fixture: ComponentFixture<FuneralMoreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuneralMoreInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuneralMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
