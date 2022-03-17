import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosAdminComponent } from './infos-admin.component';

describe('InfosAdminComponent', () => {
  let component: InfosAdminComponent;
  let fixture: ComponentFixture<InfosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfosAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
