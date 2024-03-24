import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctcategoryComponent } from './doctcategory.component';

describe('DoctcategoryComponent', () => {
  let component: DoctcategoryComponent;
  let fixture: ComponentFixture<DoctcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctcategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
