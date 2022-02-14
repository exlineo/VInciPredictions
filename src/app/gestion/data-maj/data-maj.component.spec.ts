import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMajComponent } from './data-maj.component';

describe('DataMajComponent', () => {
  let component: DataMajComponent;
  let fixture: ComponentFixture<DataMajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataMajComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
