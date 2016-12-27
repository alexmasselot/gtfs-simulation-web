/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SimulatedPositionsPixiComponent } from './simulated-positions-pixi.component';

describe('SimulatedPositionsPixiComponent', () => {
  let component: SimulatedPositionsPixiComponent;
  let fixture: ComponentFixture<SimulatedPositionsPixiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatedPositionsPixiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatedPositionsPixiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
