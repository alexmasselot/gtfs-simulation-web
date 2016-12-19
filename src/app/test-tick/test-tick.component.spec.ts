/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestTickComponent } from './test-tick.component';

describe('TestTickComponent', () => {
  let component: TestTickComponent;
  let fixture: ComponentFixture<TestTickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
