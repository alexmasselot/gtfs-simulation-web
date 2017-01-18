/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JustAMapComponent } from './just-a-map.component';

describe('JustAMapComponent', () => {
  let component: JustAMapComponent;
  let fixture: ComponentFixture<JustAMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JustAMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JustAMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
