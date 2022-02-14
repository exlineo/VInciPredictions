import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraductionsComponent } from './traductions.component';

describe('TraductionsComponent', () => {
  let component: TraductionsComponent;
  let fixture: ComponentFixture<TraductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraductionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
