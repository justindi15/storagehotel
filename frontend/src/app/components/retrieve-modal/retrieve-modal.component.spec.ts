import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveModalComponent } from './retrieve-modal.component';

describe('RetrieveModalComponent', () => {
  let component: RetrieveModalComponent;
  let fixture: ComponentFixture<RetrieveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrieveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
