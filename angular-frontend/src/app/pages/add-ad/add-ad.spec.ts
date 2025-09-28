import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAd } from './add-ad';

describe('AddAd', () => {
  let component: AddAd;
  let fixture: ComponentFixture<AddAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
