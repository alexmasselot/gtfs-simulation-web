/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TopoJsonMapComponent } from './topo-json-map.component';

describe('TopoJsonMapComponent', () => {
  let component: TopoJsonMapComponent;
  let fixture: ComponentFixture<TopoJsonMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopoJsonMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopoJsonMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
