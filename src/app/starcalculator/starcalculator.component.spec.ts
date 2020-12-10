import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarcalculatorComponent } from './starcalculator.component';

describe('StarcalculatorComponent', () => {
  let component: StarcalculatorComponent;
  let fixture: ComponentFixture<StarcalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarcalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarcalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
