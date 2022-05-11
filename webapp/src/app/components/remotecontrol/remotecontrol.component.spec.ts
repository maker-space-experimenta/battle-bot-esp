import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemotecontrolComponent } from './remotecontrol.component';

describe('RemotecontrolComponent', () => {
  let component: RemotecontrolComponent;
  let fixture: ComponentFixture<RemotecontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemotecontrolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemotecontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
