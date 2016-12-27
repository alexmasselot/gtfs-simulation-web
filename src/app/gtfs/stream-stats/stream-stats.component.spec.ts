/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StreamStatsComponent } from './stream-stats.component';

describe('StreamStatsComponent', () => {
  let component: StreamStatsComponent;
  let fixture: ComponentFixture<StreamStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
