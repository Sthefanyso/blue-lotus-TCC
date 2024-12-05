import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeelingRegisterComponent } from './feeling-register.component';

describe('FeelingRegisterComponent', () => {
  let component: FeelingRegisterComponent;
  let fixture: ComponentFixture<FeelingRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeelingRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeelingRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
