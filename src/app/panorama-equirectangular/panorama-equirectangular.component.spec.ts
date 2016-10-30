/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PanoramaEquirectangularComponent } from './panorama-equirectangular.component';

describe('PanoramaEquirectangularComponent', () => {
  let component: PanoramaEquirectangularComponent;
  let fixture: ComponentFixture<PanoramaEquirectangularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanoramaEquirectangularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanoramaEquirectangularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
