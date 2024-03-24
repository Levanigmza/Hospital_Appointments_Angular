import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorinfoComponent } from './doctorinfo.component';

describe('DoctorinfoComponent', () => {
  let component: DoctorinfoComponent;
  let fixture: ComponentFixture<DoctorinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorinfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
